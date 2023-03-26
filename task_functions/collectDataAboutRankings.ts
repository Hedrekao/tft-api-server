import axios from 'axios';
import calculateAndSaveUnitsDataIntoDb from '../helper_functions/tasks/calculateAndSaveUnitsDataIntoDb.js';
import analyzeUnitsPerformance from '../helper_functions/tasks/analyzeUnitsPerformance.js';
import calculateAndSaveAugmentsDataIntoDb from '../helper_functions/tasks/calculateAndSaveAugmentsIntoDb.js';
import calculateAndSaveItemsDataIntoDb from '../helper_functions/tasks/calculateAndSaveItemsDataIntoDb.js';
import analyzeAugmentsPerformance from '../helper_functions/tasks/analyzeAugmentsPerformance.js';
import analyzeItemsPerformance from '../helper_functions/tasks/analyzeItemsPerformance.js';
import saveTotalNumberOfMatches from '../helper_functions/tasks/saveTotalNumberOfMatches.js';
import { cache } from '../helper_functions/singletonCache.js';
import sleep from '../helper_functions/sleep.js';
import throttledQueue from 'throttled-queue';
import { clearDatabase } from '../helper_functions/tasks/clearDatabase.js';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const collectDataAboutRankings = async (limitOfMatches: number) => {
  try {
    const challengerDataResponse = await axios.get<RiotAPIChallengerData>(
      `https://euw1.api.riotgames.com/tft/league/v1/challenger`
    );

    const generalData = await prisma.general_data.findUnique({
      where: { id: 1 }
    });

    const prevAscii = generalData?.gameVersion
      .split('.')[1]
      .split('')
      .reduce((sum, char) => sum + char.charCodeAt(0), 0);

    const throttle = throttledQueue(490, 10000, true);

    const dataDragon = cache.get<DataDragon>('dataDragon');
    let totalNumberOfMatches = 0;
    let numberOfComps = 0;
    const unitsObject: CronTaskData = {};
    const itemsObject: CronTaskData = {};
    const augmentsObject: AugmentsData = {};
    const firstChoiceAugmentObject: AugmentsData = {};
    const secondChoiceAugmentObject: AugmentsData = {};
    const thirdChoiceAugmentObject: AugmentsData = {};
    const usedChallengersIdArray: Array<number> = [];
    const visitedMatches: string[] = [];
    let gameVersion;

    const challengersData = challengerDataResponse.data.entries;

    while (totalNumberOfMatches < limitOfMatches) {
      let challengerArrayId = Math.floor(
        Math.random() * challengersData.length
      );

      if (usedChallengersIdArray.length == challengersData.length) break;
      let challengerData = challengersData[challengerArrayId];
      while (
        challengerData == undefined ||
        usedChallengersIdArray.includes(challengerArrayId)
      ) {
        if (usedChallengersIdArray.length - 1 == challengersData.length) break;
        challengerArrayId = Math.floor(Math.random() * challengersData.length);
        challengerData = challengersData[challengerArrayId];
      }

      usedChallengersIdArray.push(challengerArrayId);

      const summonerPuuidResponse = await throttle(() =>
        axios.get<RiotAPISummonerDto>(
          `https://euw1.api.riotgames.com/tft/summoner/v1/summoners/${challengerData.summonerId}`
        )
      );

      const summonerPuuid = summonerPuuidResponse.data.puuid;

      const matchesIdResponse = await throttle(() =>
        axios.get(`https://europe.api.riotgames.com/tft/match/v1/matches/by-puuid/${summonerPuuid}/ids?start=0&count=15
`)
      );
      const promises = [];

      const matchesId: Array<string> = matchesIdResponse.data;
      for (const matchId of matchesId) {
        if (visitedMatches.includes(matchId)) {
          continue;
        }

        visitedMatches.push(matchId);
        const matchDataResponse = throttle(() =>
          axios
            .get<RiotAPIMatchDto>(
              `https://europe.api.riotgames.com/tft/match/v1/matches/${matchId}`
            )
            .catch((e) =>
              axios.get<RiotAPIMatchDto>(
                `https://europe.api.riotgames.com/tft/match/v1/matches/${matchId}`
              )
            )
        );

        promises.push(matchDataResponse);
      }
      const resolvedPromises = await Promise.allSettled(promises);
      const resolvedPromisesData: RiotAPIMatchDto[] = [];
      resolvedPromises.forEach(async (promise) => {
        if (promise.status == 'fulfilled') {
          if (
            parseInt(
              promise.value.headers['x-method-rate-limit-count']!.split(':')[0]
            ) >= 155
          ) {
            await sleep(5000);
          }
          resolvedPromisesData.push(promise.value.data);
        }
      });

      for (const matchData of resolvedPromisesData) {
        if (matchData.info.tft_set_core_name != 'TFTSet8_2') continue;
        const participants = matchData.info.participants;
        const gameVersionFragments = matchData.info.game_version.split('.');

        if (typeof gameVersion != 'string') {
          const asciiValue = gameVersionFragments[1]
            .split('')
            .reduce((sum, char) => sum + char.charCodeAt(0), 0);

          if (generalData != null && asciiValue > prevAscii!) {
            gameVersion = (
              gameVersionFragments[0] +
              '.' +
              gameVersionFragments[1]
            ).split(' ')[1];

            await clearDatabase();
            console.log('database cleared');
          }
        }

        for (const composition of participants) {
          numberOfComps++;
          analyzeUnitsPerformance(unitsObject, composition);
          analyzeItemsPerformance(itemsObject, composition);
          analyzeAugmentsPerformance(
            augmentsObject,
            firstChoiceAugmentObject,
            secondChoiceAugmentObject,
            thirdChoiceAugmentObject,
            composition
          );
        }
        totalNumberOfMatches++;
        if (totalNumberOfMatches == limitOfMatches) {
          saveTotalNumberOfMatches(
            totalNumberOfMatches,
            numberOfComps,
            gameVersion
          );
          calculateAndSaveUnitsDataIntoDb(unitsObject, dataDragon);
          calculateAndSaveItemsDataIntoDb(itemsObject, dataDragon);
          calculateAndSaveAugmentsDataIntoDb(
            augmentsObject,
            firstChoiceAugmentObject,
            secondChoiceAugmentObject,
            thirdChoiceAugmentObject,
            dataDragon
          );
          return;
        }
      }
    }

    saveTotalNumberOfMatches(totalNumberOfMatches, numberOfComps, gameVersion);
    calculateAndSaveUnitsDataIntoDb(unitsObject, dataDragon);
    calculateAndSaveItemsDataIntoDb(itemsObject, dataDragon);
    calculateAndSaveAugmentsDataIntoDb(
      augmentsObject,
      firstChoiceAugmentObject,
      secondChoiceAugmentObject,
      thirdChoiceAugmentObject,
      dataDragon
    );

    return;
  } catch (e: any) {
    console.log(e);
  }
};

export default collectDataAboutRankings;
