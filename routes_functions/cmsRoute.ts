import axios from 'axios';
import transformUnitsData from '../helper_functions/analyzeRoute/transformUnitsData.js';
import isCompositionMatchingInput from '../helper_functions/analyzeRoute/isCompositionMatchingInput.js';
import collectDataAboutAugments from '../helper_functions/analyzeRoute/collectDataAboutAugments.js';
import prepareAnalysisResult from '../helper_functions/analyzeRoute/prepareAnalysisResult.js';

const getStatsAndAugmentsForCoreUnits = async (
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

    const augmentsData = {};

    const challengersData: Array<any> = challengerDataResponse.data['entries'];

    for (const challengerData of challengersData) {
      const summonerPuuidResponse = await axios.get(
        `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/${challengerData['summonerId']}?api_key=${process.env.API_KEY}`
      );
      const summonerPuuid: string = summonerPuuidResponse.data['puuid'];

      const matchesIdResponse =
        await axios.get(`https://europe.api.riotgames.com/tft/match/v1/matches/by-puuid/${summonerPuuid}/ids?start=0&count=30&api_key=${process.env.API_KEY}
`);
      const matchesId: Array<string> = matchesIdResponse.data;
      for (const matchId of matchesId) {
        const matchDataResponse = await axios.get(
          `https://europe.api.riotgames.com/tft/match/v1/matches/${matchId}?api_key=${process.env.API_KEY}`
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
            collectDataAboutAugments(composition, augmentsData);
          }
          if (numberOfMatchingComps == sampleSize) {
            totalNumberOfMatches++;
            return prepareAnalysisResult(
              top4Count,
              winCount,
              placementOverall,
              numberOfMatchingComps,
              totalNumberOfMatches,
              totalNumberOfMatchesOverall + 1,
              inputData,
              augmentsData
            );
          }
        }
        if (totalNumberOfMatchesOverall == maxNumberOfMatches! - 1) {
          return prepareAnalysisResult(
            top4Count,
            winCount,
            placementOverall,
            numberOfMatchingComps,
            totalNumberOfMatches,
            totalNumberOfMatchesOverall + 1,
            inputData,
            augmentsData
          );
        }
        totalNumberOfMatchesOverall++;
      }
    }
  } catch (error: any) {
    console.log(error.message);
    return { error: `error - ${error.message}` };
  }
};

export default getStatsAndAugmentsForCoreUnits;
