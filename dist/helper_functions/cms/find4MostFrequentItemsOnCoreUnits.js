import axios from 'axios';
import transformUnitsData from '../analyzeRoute/transformUnitsData.js';
import collectDataAboutItemsCMS from './collectDataAboutItemsCMS.js';
import createItemsRates from './createItemsRates.js';
const find4MostFrequentItemsOnCoreUnits = async (compositionInput) => {
    try {
        const challengerDataResponse = await axios.get(`https://euw1.api.riotgames.com/tft/league/v1/challenger`);
        let numberOfMatchingComps = 0;
        let totalNumberOfMatches = 0;
        let totalNumberOfMatchesOverall = 0;
        const itemsData = {};
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
                    // const isAMatchCMS = isCompositionMatchingInput(
                    //   inputData,
                    //   compositionUnits
                    // );
                    // if (isAMatchCMS) {
                    numberOfMatchingComps++;
                    if (firstCompositionInMatch) {
                        totalNumberOfMatches++;
                        firstCompositionInMatch = false;
                    }
                    collectDataAboutItemsCMS(itemsData, compositionUnits, compositionInput);
                    // }
                    if (numberOfMatchingComps == 1000 /* 500 */) {
                        createItemsRates(compositionInput, numberOfMatchingComps, itemsData);
                        return;
                    }
                }
                if (totalNumberOfMatchesOverall == 500 /* 100 */) {
                    createItemsRates(compositionInput, numberOfMatchingComps, itemsData);
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
