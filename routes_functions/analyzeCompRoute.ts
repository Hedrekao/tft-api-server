import axios from 'axios';
import isCompositionMatchingInput from '../helper_functions/analyzeRoute/isCompositionMatchingInput.js';
import transformUnitsData from '../helper_functions/analyzeRoute/transformUnitsData.js';
import collectDataAboutItems from '../helper_functions/analyzeRoute/collectDataAboutItems.js';
import prepareAnalysisResult from '../helper_functions/analyzeRoute/prepareAnalysisResult.js';
import collectDataAboutAugments from '../helper_functions/analyzeRoute/collectDataAboutAugments.js';
import NodeCache from 'node-cache';

import sleep from '../helper_functions/sleep.js';

const analyzeComposition = async (
  inputData: Array<Object>,
  socketSessionId: string,
  io: any,
  cache: NodeCache,
  sampleSize?: number,
  maxNumberOfMatches?: number
) => {
  try {
    const challengerDataResponse = await axios.get(
      `https://euw1.api.riotgames.com/tft/league/v1/challenger`
    );

    let placementOverall = 0;
    let top4Count = 0;
    let winCount = 0;
    let numberOfMatchingComps = 0;
    let totalNumberOfMatches = 0;
    let totalNumberOfMatchesOverall = 0;
    let socketInstance = null;
    if (socketSessionId != undefined) {
      const thisSocketId = cache.get(socketSessionId);
      socketInstance = io.to(thisSocketId);
    }

    const itemsData = {};
    const augmentsData = {};
    let previousProgress = -1;

    const challengersData: Array<any> = challengerDataResponse.data['entries'];

    for (const challengerData of challengersData) {
      const summonerPuuidResponse = await axios.get(
        `https://euw1.api.riotgames.com/tft/summoner/v1/summoners/${challengerData['summonerId']}`
      );

      const summonerPuuid: string = summonerPuuidResponse.data['puuid'];

      const matchesIdResponse =
        await axios.get(`https://europe.api.riotgames.com/tft/match/v1/matches/by-puuid/${summonerPuuid}/ids?start=0&count=30
`);

      const matchesId: Array<string> = matchesIdResponse.data;
      for (const matchId of matchesId) {
        const matchDataResponse = await axios
          .get(
            `https://europe.api.riotgames.com/tft/match/v1/matches/${matchId}`
          )
          .catch(async (e) => {
            console.log(e);
            return await axios.get(
              `https://europe.api.riotgames.com/tft/match/v1/matches/${matchId}`
            );
          });

        const matchData: Object = matchDataResponse!.data;
        let firstCompositionInMatch = true;

        const participants = matchData['info']['participants'];

        const progress = Math.round(
          ((totalNumberOfMatchesOverall + 1) / maxNumberOfMatches!) * 100
        );
        if (socketInstance != null) {
          if (progress != previousProgress) {
            socketInstance.emit('uploadProgress', progress);
          }
        }

        previousProgress = progress;

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
            collectDataAboutItems(
              composition,
              inputData,
              itemsData,
              compositionUnits
            );
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
              augmentsData,
              itemsData
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
            augmentsData,
            itemsData
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

export default analyzeComposition;
