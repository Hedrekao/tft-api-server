import axios from 'axios';
import isCompositionMatchingInput from '../helper_functions/analyzeRoute/isCompositionMatchingInput.js';
import transformUnitsData from '../helper_functions/analyzeRoute/transformUnitsData.js';
import collectDataAboutItems from '../helper_functions/analyzeRoute/collectDataAboutItems.js';
import prepareAnalysisResult from '../helper_functions/analyzeRoute/prepareAnalysisResult.js';
import collectDataAboutAugments from '../helper_functions/analyzeRoute/collectDataAboutAugments.js';

const analyzeCompositionTest = async (
  inputData: Array<Object>,
  sampleSize?: number,
  maxNumberOfMatches?: number
) => {
  try {
    let placementOverall = 0;
    let top4Count = 0;
    let winCount = 0;
    let numberOfMatchingComps = 0;
    let totalNumberOfMatches = 0;
    let totalNumberOfMatchesOverall = 0; // added new variable totalNumberOfMatchesOverall

    const itemsData = {};
    const augmentsData = {};

    const summonerPuuidResponse = await axios.get(
      `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/AGO%20zbrojson?api_key=${process.env.API_KEY}`
    );
    const summonerPuuid: string = summonerPuuidResponse.data['puuid'];

    const matchesIdResponse =
      await axios.get(`https://europe.api.riotgames.com/tft/match/v1/matches/by-puuid/${summonerPuuid}/ids?start=0&count=2&api_key=${process.env.API_KEY}
`);
    const matchesId: Array<string> = matchesIdResponse.data;
    for (const matchId of matchesId) {
      const matchDataResponse = await axios.get(
        `https://europe.api.riotgames.com/tft/match/v1/matches/${matchId}?api_key=${process.env.API_KEY}`
      );

      const matchData: Object = matchDataResponse.data;
      let firstCompositionInMatch = true;

      const participants = matchData['info']['participants']; // ADDED INFO BEFORE PARTICIPAnts

      for (const composition of participants) {
        const compositionUnits = transformUnitsData(composition['units']);

        const isAMatch = isCompositionMatchingInput(
          inputData,
          compositionUnits
        );

        // console.log(isAMatch);
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
          collectDataAboutItems(
            composition,
            inputData,
            itemsData,
            compositionUnits
          ); // added composition units to method
        }
        if (
          numberOfMatchingComps == sampleSize
          //   totalNumberOfMatchesOverall == maxNumberOfMatches! - 1 // changed to matches overralll
        ) {
          //   totalNumberOfMatches++; // delete this line
          // console.log(itemsData);
          // console.log(augmentsData);
          return prepareAnalysisResult(
            top4Count,
            winCount,
            placementOverall,
            numberOfMatchingComps,
            totalNumberOfMatches,
            inputData,
            itemsData,
            augmentsData
          );
        }
      }
      if (totalNumberOfMatchesOverall == maxNumberOfMatches! - 1) {
        // console.log(itemsData);
        // console.log(augmentsData);
        // console.log(numberOfMatchingComps);
        return prepareAnalysisResult(
          top4Count,
          winCount,
          placementOverall,
          numberOfMatchingComps,
          totalNumberOfMatches,
          inputData,
          itemsData,
          augmentsData
        );
      } // added this shit
      totalNumberOfMatchesOverall++; // increment after every match
    }
  } catch (error: any) {
    console.log(error.message);
  }
};

export default analyzeCompositionTest;
