import axios from 'axios';
import transformUnitsData from '../analyzeRoute/transformUnitsData.js';
import collectDataAboutItemsCMS from './collectDataAboutItemsCMS.js';
import createItemsRates from './createItemsRates.js';
import isCompositionMatchingInputCMS from './isCompositionMatchingInputCMS.js';
import collectDataAboutAugments from '../analyzeRoute/collectDataAboutAugments.js';
import collectDataAboutVariation from './collectDataAboutVariation.js';
import analyzeCompositionAugments from './analyzeCompositionAugments.js';
import analyzeVariationPerformance from './analyzeVariationPerformance.js';
const find4MostFrequentItemsOnCoreUnits = async (compositionInput) => {
    try {
        const challengerDataResponse = await axios.get(`https://euw1.api.riotgames.com/tft/league/v1/challenger`);
        let numberOfMatchingComps = 0;
        let totalNumberOfMatches = 0;
        let numberOfAugmentMatchingComps = 0;
        let totalNumberOfMatchesOverall = 0;
        const itemsData = {};
        const augmentData = {};
        const variationPerformance = [];
        const challengersData = challengerDataResponse.data['entries'];
        for (const challengerData of challengersData) {
            const summonerPuuidResponse = await axios.get(`https://euw1.api.riotgames.com/tft/summoner/v1/summoners/${challengerData['summonerId']}`);
            const summonerPuuid = summonerPuuidResponse.data['puuid'];
            const matchesIdResponse = await axios.get(`https://europe.api.riotgames.com/tft/match/v1/matches/by-puuid/${summonerPuuid}/ids?start=0&count=30
`);
            const matchesId = matchesIdResponse.data;
            for (const matchId of matchesId) {
                const matchDataResponse = await axios.get(`https://europe.api.riotgames.com/tft/match/v1/matches/${matchId}`);
                const matchData = matchDataResponse.data;
                let firstCompositionInMatch = true;
                const participants = matchData['info']['participants'];
                for (const composition of participants) {
                    const compositionUnits = transformUnitsData(composition['units']);
                    const isMatchForAugmentCheck = isCompositionMatchingInputCMS(compositionInput, compositionUnits);
                    if (isMatchForAugmentCheck) {
                        collectDataAboutAugments(composition, augmentData);
                        numberOfAugmentMatchingComps++;
                    }
                    for (const [index, variation] of compositionInput.variations.entries()) {
                        const isMatchForVariationCheck = isCompositionMatchingInputCMS(variation, compositionUnits);
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
                    if (numberOfMatchingComps == 1500 /* 500 */) {
                        createItemsRates(compositionInput, numberOfMatchingComps, itemsData);
                        analyzeCompositionAugments(augmentData, compositionInput, numberOfAugmentMatchingComps);
                        for (const [index, variation] of compositionInput.variations.entries()) {
                            analyzeVariationPerformance(variation, variationPerformance[index]);
                        }
                        return;
                    }
                }
                if (totalNumberOfMatchesOverall == 1500 /* 100 */) {
                    createItemsRates(compositionInput, numberOfMatchingComps, itemsData);
                    analyzeCompositionAugments(augmentData, compositionInput, numberOfAugmentMatchingComps);
                    for (const [index, variation] of compositionInput.variations.entries()) {
                        analyzeVariationPerformance(variation, variationPerformance[index]);
                    }
                    return;
                }
                totalNumberOfMatchesOverall++;
            }
        }
    }
    catch (error) {
        console.log(error.message);
        return { error: `error - ${error.message}` };
    }
};
// 6 itemow kazdy unit w compie
export default find4MostFrequentItemsOnCoreUnits;
