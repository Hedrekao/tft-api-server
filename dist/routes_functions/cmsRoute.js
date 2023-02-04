import axios from 'axios';
import transformUnitsData from '../helper_functions/analyzeRoute/transformUnitsData.js';
import prepareAnalysisResult from '../helper_functions/analyzeRoute/prepareAnalysisResult.js';
import sleep from '../helper_functions/sleep.js';
import isCompositionMatchingInput from '../helper_functions/analyzeRoute/isCompositionMatchingInput.js';
import throttledQueue from 'throttled-queue';
const getPerformanceForCoreUnits = async (inputData, sampleSize, maxNumberOfMatches) => {
    try {
        const challengerDataResponse = await axios.get(`https://euw1.api.riotgames.com/tft/league/v1/challenger?api_key=${process.env.API_KEY}`);
        const throttle = throttledQueue(500, 10000);
        let placementOverall = 0;
        let top4Count = 0;
        let winCount = 0;
        let numberOfMatchingComps = 0;
        let totalNumberOfMatches = 0;
        let totalNumberOfMatchesOverall = 0;
        const usedChallengersIdArray = [];
        const visitedMatches = [];
        const challengersData = challengerDataResponse.data.entries;
        while (totalNumberOfMatchesOverall < maxNumberOfMatches) {
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
                    if (parseInt(promise.value.headers['x-method-rate-limit-count'].split(':')[0]) >= 165) {
                        await sleep(5000);
                    }
                    resolvedPromisesData.push(promise.value.data);
                }
            });
            for (const matchData of resolvedPromisesData) {
                let firstCompositionInMatch = true;
                const participants = matchData.info.participants;
                for (const composition of participants) {
                    const compositionUnits = transformUnitsData(composition.units);
                    const isAMatch = isCompositionMatchingInput(inputData, compositionUnits);
                    if (isAMatch) {
                        numberOfMatchingComps++;
                        if (firstCompositionInMatch) {
                            totalNumberOfMatches++;
                            firstCompositionInMatch = false;
                        }
                        placementOverall += composition.placement;
                        if (composition.placement <= 4) {
                            top4Count++;
                            if (composition.placement == 1) {
                                winCount++;
                            }
                        }
                    }
                }
                totalNumberOfMatchesOverall++;
            }
        }
        return prepareAnalysisResult(top4Count, winCount, placementOverall, numberOfMatchingComps, totalNumberOfMatches, totalNumberOfMatchesOverall + 1, inputData);
    }
    catch (error) {
        console.log(error.message);
        return { error: `error - ${error.message}` };
    }
};
export default getPerformanceForCoreUnits;
