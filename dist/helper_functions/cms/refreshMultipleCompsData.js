import axios from 'axios';
import collectDataAboutAugments from '../analyzeRoute/collectDataAboutAugments.js';
import transformUnitsData from '../analyzeRoute/transformUnitsData.js';
import { cache } from '../singletonCache.js';
import sleep from '../sleep.js';
import throttledQueue from 'throttled-queue';
import analyzeCompositionAugments from './analyzeCompositionAugments.js';
import analyzeVariationPerformance from './analyzeVariationPerformance.js';
import collectDataAboutItemsCMS from './collectDataAboutItemsCMS.js';
import collectDataAboutVariation from './collectDataAboutVariation.js';
import createItemsRates from './createItemsRates.js';
import isCompositionMatchingInputCMS from './isCompositionMatchingInputCMS.js';
export async function refreshMultipleCompsData(input) {
    try {
        const challengerDataResponse = await axios.get(`https://euw1.api.riotgames.com/tft/league/v1/challenger`);
        const throttle = throttledQueue(490, 10000, true);
        const dataDragon = cache.get('dataDragon');
        let totalNumberOfMatches = 0;
        const usedChallengersIdArray = [];
        const visitedMatches = [];
        const challengersData = challengerDataResponse.data.entries;
        while (totalNumberOfMatches < 1000) {
            let challengerArrayId = Math.floor(Math.random() * challengersData.length);
            let challengerData = challengersData[challengerArrayId];
            while (challengerData == undefined ||
                usedChallengersIdArray.includes(challengerArrayId)) {
                if (usedChallengersIdArray.length - 1 == challengersData.length)
                    break;
                challengerArrayId = Math.floor(Math.random() * challengersData.length);
                challengerData = challengersData[challengerArrayId];
            }
            usedChallengersIdArray.push(challengerArrayId);
            const summonerPuuidResponse = await throttle(() => axios.get(`https://euw1.api.riotgames.com/tft/summoner/v1/summoners/${challengerData.summonerId}`));
            const summonerPuuid = summonerPuuidResponse.data.puuid;
            const matchesIdResponse = await throttle(() => axios.get(`https://europe.api.riotgames.com/tft/match/v1/matches/by-puuid/${summonerPuuid}/ids?start=0&count=15
          `));
            const promises = [];
            const matchesId = matchesIdResponse.data;
            for (const matchId of matchesId) {
                if (visitedMatches.includes(matchId)) {
                    continue;
                }
                visitedMatches.push(matchId);
                const matchDataResponse = throttle(() => axios
                    .get(`https://europe.api.riotgames.com/tft/match/v1/matches/${matchId}`)
                    .catch((e) => axios.get(`https://europe.api.riotgames.com/tft/match/v1/matches/${matchId}`)));
                promises.push(matchDataResponse);
            }
            const resolvedPromises = await Promise.allSettled(promises);
            const resolvedPromisesData = [];
            resolvedPromises.forEach(async (promise) => {
                if (promise.status == 'fulfilled') {
                    if (parseInt(promise.value.headers['x-method-rate-limit-count'].split(':')[0]) >= 155) {
                        await sleep(5000);
                    }
                    resolvedPromisesData.push(promise.value.data);
                }
            });
            for (const matchData of resolvedPromisesData) {
                const participants = matchData.info.participants;
                totalNumberOfMatches++;
                for (const composition of participants) {
                    const compositionUnits = transformUnitsData(composition.units);
                    for (const inputComp of input) {
                        const isMatching = isCompositionMatchingInputCMS(inputComp.comp, compositionUnits);
                        for (const [index, variation] of inputComp.comp.variations.entries()) {
                            const isMatchForVariationCheck = isCompositionMatchingInputCMS(variation, compositionUnits);
                            if (typeof inputComp.variationPerformance[index] != 'object') {
                                inputComp.variationPerformance[index] = {
                                    placementOverall: 0,
                                    top4Count: 0,
                                    numberOfComps: 0
                                };
                            }
                            if (isMatchForVariationCheck) {
                                collectDataAboutVariation(composition, inputComp.variationPerformance[index]);
                            }
                        }
                        collectDataAboutItemsCMS(inputComp.itemsData, compositionUnits, inputComp.comp);
                        if (!isMatching)
                            continue;
                        collectDataAboutAugments(composition, inputComp.augmentData);
                        inputComp.placementOverall += composition.placement;
                        if (composition.placement <= 4) {
                            inputComp.top4Count++;
                            if (composition.placement == 1) {
                                inputComp.winCount++;
                            }
                            inputComp.currentNumberOfComps++;
                        }
                    }
                }
                if (totalNumberOfMatches == 1000) {
                    for (const inputComp of input) {
                        const comp = inputComp.comp;
                        createItemsRates(inputComp.comp, inputComp.itemsData, dataDragon);
                        analyzeCompositionAugments(inputComp.augmentData, inputComp.comp, inputComp.currentNumberOfComps, dataDragon);
                        for (const [index, variation] of inputComp.comp.variations.entries()) {
                            analyzeVariationPerformance(variation, inputComp.variationPerformance[index]);
                        }
                        comp.avgPlacement = parseFloat((inputComp.placementOverall / inputComp.currentNumberOfComps).toFixed(2));
                        comp.winrate = parseFloat(((inputComp.winCount / inputComp.currentNumberOfComps) *
                            100).toFixed(2));
                        comp.top4Ratio = parseFloat(((inputComp.top4Count / inputComp.currentNumberOfComps) *
                            100).toFixed(2));
                        comp.playrate = parseFloat((inputComp.currentNumberOfComps / totalNumberOfMatches).toFixed(2));
                    }
                    return;
                }
            }
        }
        for (const inputComp of input) {
            const comp = inputComp.comp;
            createItemsRates(inputComp.comp, inputComp.itemsData, dataDragon);
            analyzeCompositionAugments(inputComp.augmentData, inputComp.comp, inputComp.currentNumberOfComps, dataDragon);
            for (const [index, variation] of inputComp.comp.variations.entries()) {
                analyzeVariationPerformance(variation, inputComp.variationPerformance[index]);
            }
            comp.avgPlacement = parseFloat((inputComp.placementOverall / inputComp.currentNumberOfComps).toFixed(2));
            comp.winrate = parseFloat(((inputComp.winCount / inputComp.currentNumberOfComps) * 100).toFixed(2));
            comp.top4Ratio = parseFloat(((inputComp.top4Count / inputComp.currentNumberOfComps) * 100).toFixed(2));
            comp.playrate = parseFloat((inputComp.currentNumberOfComps / totalNumberOfMatches).toFixed(2));
        }
        return;
    }
    catch (e) {
        console.log(e.message);
    }
}
