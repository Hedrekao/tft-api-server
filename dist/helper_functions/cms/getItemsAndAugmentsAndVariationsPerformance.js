import axios from 'axios';
import transformUnitsData from '../analyzeRoute/transformUnitsData.js';
import collectDataAboutItemsCMS from './collectDataAboutItemsCMS.js';
import createItemsRates from './createItemsRates.js';
import isCompositionMatchingInputCMS from './isCompositionMatchingInputCMS.js';
import collectDataAboutAugments from '../analyzeRoute/collectDataAboutAugments.js';
import collectDataAboutVariation from './collectDataAboutVariation.js';
import analyzeCompositionAugments from './analyzeCompositionAugments.js';
import analyzeVariationPerformance from './analyzeVariationPerformance.js';
import sleep from '../sleep.js';
import { cache } from '../singletonCache.js';
const find4MostFrequentItemsOnCoreUnits = async (compositionInput) => {
    try {
        const challengerDataResponse = await axios.get(`https://euw1.api.riotgames.com/tft/league/v1/challenger`);
        console.log(1);
        const dataDragon = cache.get('dataDragon');
        let numberOfMatchingComps = 0;
        let totalNumberOfMatches = 0;
        let numberOfAugmentMatchingComps = 0;
        let totalNumberOfMatchesOverall = 0;
        const usedChallengersIdArray = [];
        const visitedMatches = [];
        const itemsData = {};
        const augmentData = {};
        const variationPerformance = [];
        const challengersData = challengerDataResponse.data.entries;
        while (totalNumberOfMatchesOverall < 1000) {
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
            const summonerPuuidResponse = await axios.get(`https://euw1.api.riotgames.com/tft/summoner/v1/summoners/${challengerData['summonerId']}`);
            console.log(2);
            const summonerPuuid = summonerPuuidResponse.data.puuid;
            const matchesIdResponse = await axios.get(`https://europe.api.riotgames.com/tft/match/v1/matches/by-puuid/${summonerPuuid}/ids?start=0&count=15
`);
            console.log(3);
            const promises = [];
            const matchesId = matchesIdResponse.data;
            for (const matchId of matchesId) {
                if (visitedMatches.includes(matchId)) {
                    continue;
                }
                else {
                    visitedMatches.push(matchId);
                }
                const matchDataResponse = axios
                    .get(`https://europe.api.riotgames.com/tft/match/v1/matches/${matchId}`)
                    .catch(async (e) => await axios.get(`https://europe.api.riotgames.com/tft/match/v1/matches/${matchId}`))
                    .catch(async (e) => await axios.get(`https://europe.api.riotgames.com/tft/match/v1/matches/${matchId}`));
                console.log(4);
                promises.push(matchDataResponse);
            }
            console.log('4 - done');
            const resolvedPromises = await Promise.allSettled(promises);
            const resolvedPromisesData = [];
            resolvedPromises.forEach(async (promise) => {
                if (promise.status == 'fulfilled') {
                    if (parseInt(promise.value.headers['x-method-rate-limit-count'].split(':')[0]) >= 150) {
                        await sleep(7000);
                    }
                    resolvedPromisesData.push(promise.value.data);
                }
            });
            for (const matchData of resolvedPromisesData) {
                let firstCompositionInMatch = true;
                const participants = matchData.info.participants;
                for (const composition of participants) {
                    const compositionUnits = transformUnitsData(composition.units);
                    const isMatchForAugmentCheck = isCompositionMatchingInputCMS(compositionInput, compositionUnits);
                    if (isMatchForAugmentCheck) {
                        collectDataAboutAugments(composition, augmentData);
                        numberOfAugmentMatchingComps++;
                    }
                    for (const [index, variation] of compositionInput.variations.entries()) {
                        const isMatchForVariationCheck = isCompositionMatchingInputCMS(variation, compositionUnits);
                        if (typeof variationPerformance[index] != 'object') {
                            variationPerformance[index] = {
                                placementOverall: 0,
                                top4Count: 0,
                                numberOfComps: 0
                            };
                        }
                        if (isMatchForVariationCheck) {
                            collectDataAboutVariation(composition, variationPerformance[index]);
                        }
                    }
                    numberOfMatchingComps++;
                    if (firstCompositionInMatch) {
                        totalNumberOfMatches++;
                        firstCompositionInMatch = false;
                    }
                    collectDataAboutItemsCMS(itemsData, compositionUnits, compositionInput);
                    // }
                }
                totalNumberOfMatchesOverall++;
                if (totalNumberOfMatchesOverall == 1000) {
                    createItemsRates(compositionInput, numberOfMatchingComps, itemsData, dataDragon);
                    analyzeCompositionAugments(augmentData, compositionInput, numberOfAugmentMatchingComps, dataDragon);
                    for (const [index, variation] of compositionInput.variations.entries()) {
                        analyzeVariationPerformance(variation, variationPerformance[index]);
                    }
                    return;
                }
            }
        }
        createItemsRates(compositionInput, numberOfMatchingComps, itemsData, dataDragon);
        analyzeCompositionAugments(augmentData, compositionInput, numberOfAugmentMatchingComps, dataDragon);
        for (const [index, variation] of compositionInput.variations.entries()) {
            analyzeVariationPerformance(variation, variationPerformance[index]);
        }
        return;
    }
    catch (error) {
        console.log(error.message);
        return { error: `error - ${error.message}` };
    }
};
export default find4MostFrequentItemsOnCoreUnits;
