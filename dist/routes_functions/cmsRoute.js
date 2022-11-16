import axios from 'axios';
import transformUnitsData from '../helper_functions/analyzeRoute/transformUnitsData.js';
import prepareAnalysisResult from '../helper_functions/analyzeRoute/prepareAnalysisResult.js';
import isCompositionMatchingInput from '../helper_functions/analyzeRoute/isCompositionMatchingInput.js';
const getPerformanceForCoreUnits = async (inputData, sampleSize, maxNumberOfMatches) => {
    try {
        const challengerDataResponse = await axios.get(`https://euw1.api.riotgames.com/tft/league/v1/challenger?api_key=${process.env.API_KEY}`);
        let placementOverall = 0;
        let top4Count = 0;
        let winCount = 0;
        let numberOfMatchingComps = 0;
        let totalNumberOfMatches = 0;
        let totalNumberOfMatchesOverall = 0;
        const usedChallengersIdArray = [];
        const challengersData = challengerDataResponse.data['entries'];
        while (totalNumberOfMatchesOverall < maxNumberOfMatches) {
            let challengerArrayId = Math.floor(Math.random() * challengersData.length);
            challengerArrayId++;
            let challengerData = challengersData[challengerArrayId];
            if (challengerData == undefined) {
                challengerArrayId = Math.floor(Math.random() * challengersData.length);
                challengerData = challengersData[challengerArrayId];
            }
            const summonerPuuidResponse = await axios.get(`https://euw1.api.riotgames.com/tft/summoner/v1/summoners/${challengerData['summonerId']}`);
            const summonerPuuid = summonerPuuidResponse.data['puuid'];
            const matchesIdResponse = await axios.get(`https://europe.api.riotgames.com/tft/match/v1/matches/by-puuid/${summonerPuuid}/ids?start=0&count=15
`);
            const matchesId = matchesIdResponse.data;
            for (const matchId of matchesId) {
                console.log(matchId);
                const matchDataResponse = await axios.get(`https://europe.api.riotgames.com/tft/match/v1/matches/${matchId}`);
                console.log(1);
                const matchData = matchDataResponse.data;
                let firstCompositionInMatch = true;
                const participants = matchData['info']['participants'];
                for (const composition of participants) {
                    const compositionUnits = transformUnitsData(composition['units']);
                    const isAMatch = isCompositionMatchingInput(inputData, compositionUnits);
                    if (isAMatch) {
                        numberOfMatchingComps++;
                        if (firstCompositionInMatch) {
                            totalNumberOfMatches++;
                            firstCompositionInMatch = false;
                        }
                        placementOverall += composition['placement'];
                        if (composition['placement'] <= 4) {
                            top4Count++;
                            if (composition['placement'] == 1) {
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
