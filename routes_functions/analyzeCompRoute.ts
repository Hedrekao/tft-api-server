import axios from 'axios';
import isCompositionMatchingInput from '../helper_functions/analyzeRoute/isCompositionMatchingInput.js';
import transformUnitsData from '../helper_functions/analyzeRoute/transformUnitsData.js';
import collectDataAboutItems from '../helper_functions/analyzeRoute/collectDataAboutItems.js';
import prepareAnalysisResult from '../helper_functions/analyzeRoute/prepareAnalysisResult.js';
import collectDataAboutAugments from '../helper_functions/analyzeRoute/collectDataAboutAugments.js';
import { cache } from '../helper_functions/singletonCache.js';

import sleep from '../helper_functions/sleep.js';

const analyzeComposition = async (
  inputData: AnalysisInputData,
  socketSessionId: string,
  io: any,
  sampleSize?: number,
  maxNumberOfMatches?: number
) => {
  try {
    const challengerDataResponse = await axios
      .get(`https://euw1.api.riotgames.com/tft/league/v1/challenger`)
      .catch(async (e) => {
        return axios.get(
          `https://euw1.api.riotgames.com/tft/league/v1/challenger}`
        );
      });

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

    const itemsData: ItemsData = {};
    const augmentsData: AugmentsData = {};
    let previousProgress = -1;

    const challengersData: RiotAPIChallengerDataEntry[] =
      challengerDataResponse.data['entries'];

    const visitedMatches: string[] = [];

    for (const challengerData of challengersData) {
      const summonerPuuidResponse = await axios
        .get<RiotAPISummonerDto>(
          `https://euw1.api.riotgames.com/tft/summoner/v1/summoners/${challengerData.summonerId}`
        )
        .catch(async (e) => {
          return axios.get<RiotAPISummonerDto>(
            `https://euw1.api.riotgames.com/tft/summoner/v1/summoners/${challengerData.summonerId}`
          );
        });

      const summonerPuuid: string = summonerPuuidResponse.data.puuid;

      const matchesIdResponse = await axios
        .get(
          `https://europe.api.riotgames.com/tft/match/v1/matches/by-puuid/${summonerPuuid}/ids?start=0&count=10
`
        )
        .catch(async (e) => {
          return axios.get(
            `https://europe.api.riotgames.com/tft/match/v1/matches/by-puuid/${summonerPuuid}/ids?start=0&count=10`
          );
        });
      const promises = [];
      const matchesId: Array<string> = matchesIdResponse.data;
      for (const matchId of matchesId) {
        if (visitedMatches.includes(matchId)) {
          continue;
        } else {
          visitedMatches.push(matchId);
        }

        const matchDataResponse = axios
          .get<RiotAPIMatchDto>(
            `https://europe.api.riotgames.com/tft/match/v1/matches/${matchId}`
          )
          .catch(async (e) => {
            return axios
              .get<RiotAPIMatchDto>(
                `https://europe.api.riotgames.com/tft/match/v1/matches/${matchId}`
              )
              .catch(async (e) => {
                return axios.get<RiotAPIMatchDto>(
                  `https://europe.api.riotgames.com/tft/match/v1/matches/${matchId}`
                );
              });
          });

        promises.push(matchDataResponse);
      }

      const resolvedPromises = await Promise.allSettled(promises);
      const resolvedPromisesData: RiotAPIMatchDto[] = [];
      resolvedPromises.forEach(async (promise) => {
        if (promise.status == 'fulfilled') {
          if (
            parseInt(
              promise.value.headers['x-method-rate-limit-count']!.split(':')[0]
            ) >= 165
          ) {
            await sleep(5000);
          }
          resolvedPromisesData.push(promise.value.data);
        }
      });

      for (const matchData of resolvedPromisesData) {
        let firstCompositionInMatch = true;

        const participants = matchData.info.participants;

        const progress = Math.round(
          ((totalNumberOfMatchesOverall + 1) / maxNumberOfMatches!) * 100
        );
        if (socketInstance != null) {
          if (progress != previousProgress && progress != 100) {
            socketInstance.emit('uploadProgress', progress);
          }
        }

        previousProgress = progress;

        for (const composition of participants) {
          const compositionUnits = transformUnitsData(composition.units);

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
            placementOverall += composition.placement;
            if (composition.placement <= 4) {
              top4Count++;
              if (composition.placement == 1) {
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
          if (totalNumberOfMatchesOverall == maxNumberOfMatches! - 1) {
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
  } catch (error: any) {
    console.log(error.message);
    return { error: `error - ${error.message}` };
  }
};

export default analyzeComposition;
