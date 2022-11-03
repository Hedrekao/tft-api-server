import axios from 'axios';
import transformUnitsData from '../helper_functions/analyzeRoute/transformUnitsData.js';
import isCompositionMatchingInput from '../helper_functions/analyzeRoute/isCompositionMatchingInput.js';
import prepareAnalysisResult from '../helper_functions/analyzeRoute/prepareAnalysisResult.js';
const getPerformanceForCoreUnits = async (inputData, sampleSize, maxNumberOfMatches) => {
    try {
        const challengerDataResponse = await axios.get(`https://euw1.api.riotgames.com/tft/league/v1/challenger?api_key=${process.env.API_KEY}`);
        let placementOverall = 0;
        let top4Count = 0;
        let winCount = 0;
        let numberOfMatchingComps = 0;
        let totalNumberOfMatches = 0;
        let totalNumberOfMatchesOverall = 0;
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
                    if (numberOfMatchingComps == sampleSize) {
                        totalNumberOfMatches++;
                        return prepareAnalysisResult(top4Count, winCount, placementOverall, numberOfMatchingComps, totalNumberOfMatches, totalNumberOfMatchesOverall + 1, inputData);
                    }
                }
                if (totalNumberOfMatchesOverall == maxNumberOfMatches - 1) {
                    return prepareAnalysisResult(top4Count, winCount, placementOverall, numberOfMatchingComps, totalNumberOfMatches, totalNumberOfMatchesOverall + 1, inputData);
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
export default getPerformanceForCoreUnits;
