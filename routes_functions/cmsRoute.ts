import axios from 'axios';
import transformUnitsData from '../helper_functions/analyzeRoute/transformUnitsData.js';
import collectDataAboutAugments from '../helper_functions/analyzeRoute/collectDataAboutAugments.js';
import prepareAnalysisResult from '../helper_functions/analyzeRoute/prepareAnalysisResult.js';
import sleep from '../helper_functions/sleep.js';
import isCompositionMatchingInput from '../helper_functions/analyzeRoute/isCompositionMatchingInput.js';

const getPerformanceForCoreUnits = async (
  inputData: Array<Object>,
  sampleSize?: number,
  maxNumberOfMatches?: number
) => {
  try {
    const challengerDataResponse = await axios.get(
      `https://euw1.api.riotgames.com/tft/league/v1/challenger?api_key=${process.env.API_KEY}`
    );

    let placementOverall = 0;
    let top4Count = 0;
    let winCount = 0;
    let numberOfMatchingComps = 0;
    let totalNumberOfMatches = 0;
    let totalNumberOfMatchesOverall = 0;
    const usedChallengersIdArray: Array<number> = [];

    const challengersData: Array<any> = challengerDataResponse.data['entries'];

    while (totalNumberOfMatchesOverall < maxNumberOfMatches!) {
      let challengerArrayId = Math.floor(
        Math.random() * challengersData.length
      );
      challengerArrayId++;

      console.log(totalNumberOfMatchesOverall);
      console.log('essa ' + challengerArrayId);

      let challengerData = challengersData[challengerArrayId];
      if (challengerData == undefined) {
        challengerArrayId = Math.floor(Math.random() * challengersData.length);
        challengerData = challengersData[challengerArrayId];
      }
      const summonerPuuidResponse = await axios.get(
        `https://euw1.api.riotgames.com/tft/summoner/v1/summoners/${challengerData['summonerId']}`
      );

      const summonerPuuid: string = summonerPuuidResponse.data['puuid'];

      const matchesIdResponse =
        await axios.get(`https://europe.api.riotgames.com/tft/match/v1/matches/by-puuid/${summonerPuuid}/ids?start=0&count=10
`);

      const matchesId: Array<string> = matchesIdResponse.data;
      for (const matchId of matchesId) {
        const matchDataResponse = await axios.get(
          `https://europe.api.riotgames.com/tft/match/v1/matches/${matchId}`
        );

        const matchData: Object = matchDataResponse.data;
        let firstCompositionInMatch = true;

        const participants = matchData['info']['participants'];

        for (const composition of participants) {
          const compositionUnits = transformUnitsData(composition['units']);

          const isAMatch = isCompositionMatchingInput(
            inputData,
            compositionUnits
          );

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
    return prepareAnalysisResult(
      top4Count,
      winCount,
      placementOverall,
      numberOfMatchingComps,
      totalNumberOfMatches,
      totalNumberOfMatchesOverall + 1,
      inputData
    );
  } catch (error: any) {
    console.log(error.message);
    return { error: `error - ${error.message}` };
  }
};

export default getPerformanceForCoreUnits;
