import axios from 'axios';
import transformUnitsData from '../analyzeRoute/transformUnitsData.js';
import collectDataAboutItemsCMS from './collectDataAboutItemsCMS.js';
import createItemsRates from './createItemsRates.js';
const find4MostFrequentItemsOnCoreUnits = async (compositionInput) => {
    try {
        const requestObject = { totalRequest: 0, currentRequest: 0 };
        const challengerDataResponse = await axios.get(`https://euw1.api.riotgames.com/tft/league/v1/challenger`);
        // requestObject.totalRequest++;
        // requestObject.currentRequest++;
        let numberOfMatchingComps = 0;
        let totalNumberOfMatches = 0;
        let totalNumberOfMatchesOverall = 0;
        const itemsData = {};
        const challengersData = challengerDataResponse.data['entries'];
        for (const challengerData of challengersData) {
            const summonerPuuidResponse = await axios.get(`https://euw1.api.riotgames.com/tft/summoner/v1/summoners/${challengerData['summonerId']}`);
            // requestObject.totalRequest++;
            // requestObject.currentRequest++;
            // if (requestObject.currentRequest >= 18) {
            //   await sleep(1000);
            //   requestObject.currentRequest = 0;
            // }
            const summonerPuuid = summonerPuuidResponse.data['puuid'];
            const matchesIdResponse = await axios.get(`https://europe.api.riotgames.com/tft/match/v1/matches/by-puuid/${summonerPuuid}/ids?start=0&count=30
`);
            // requestObject.totalRequest++;
            // requestObject.currentRequest++;
            // if (requestObject.currentRequest >= 18) {
            //   await sleep(1000);
            //   requestObject.currentRequest = 0;
            // }
            const matchesId = matchesIdResponse.data;
            for (const matchId of matchesId) {
                // if (requestObject.totalRequest >= 98) {
                //   console.log('Limit of requests');
                //   createItemsRates(compositionInput, numberOfMatchingComps, itemsData);
                //   return;
                // }
                const matchDataResponse = await axios.get(`https://europe.api.riotgames.com/tft/match/v1/matches/${matchId}`);
                // requestObject.totalRequest++;
                // requestObject.currentRequest++;
                // if (requestObject.currentRequest >= 18) {
                //   await sleep(1000);
                //   requestObject.currentRequest = 0;
                // }
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
                    if (numberOfMatchingComps == 100 /* 500 */) {
                        createItemsRates(compositionInput, numberOfMatchingComps, itemsData);
                        return;
                    }
                }
                if (totalNumberOfMatchesOverall == 69 /* 100 */) {
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
