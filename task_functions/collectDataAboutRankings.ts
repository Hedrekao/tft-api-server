import axios from 'axios';
import calculateAndSaveUnitsDataIntoDb from '../helper_functions/tasks/calculateAndSaveUnitsDataIntoDb.js';
import analyzeUnitsPerformance from '../helper_functions/tasks/analyzeUnitsPerformance.js';
import calculateAndSaveAugmentsDataIntoDb from '../helper_functions/tasks/calculateAndSaveAugmentsIntoDb.js';
import calculateAndSaveItemsDataIntoDb from '../helper_functions/tasks/calculateAndSaveItemsDataIntoDb.js';
import analyzeAugmentsPerformance from '../helper_functions/tasks/analyzeAugmentsPerformance.js';
import analyzeItemsPerformance from '../helper_functions/tasks/analyzeItemsPerformance.js';
import saveTotalNumberOfMatches from '../helper_functions/tasks/saveTotalNumberOfMatches.js';
import fs from 'fs';
import sleep from '../helper_functions/sleep.js';

const collectDataAboutRankings = async (limitOfMatches: number) => {
  try {
    const challengerDataResponse = await axios.get<RiotAPIChallengerData>(
      `https://euw1.api.riotgames.com/tft/league/v1/challenger`
    );

    let totalNumberOfMatches = 0;
    let numberOfComps = 0;
    const unitsObject = {};
    const itemsObject = {};
    const augmentsObject = {};
    const firstChoiceAugmentObject = {};
    const secondChoiceAugmentObject = {};
    const thirdChoiceAugmentObject = {};
    // const usedChallengersIdArray: Array<number> = [];

    const challengersData: Array<any> = challengerDataResponse.data.entries;

    while (totalNumberOfMatches < limitOfMatches) {
      let challengerArrayId = Math.floor(
        Math.random() * challengersData.length
      );
      challengerArrayId++;

      let challengerData = challengersData[challengerArrayId];
      if (challengerData == undefined) {
        challengerArrayId = Math.floor(Math.random() * challengersData.length);
        challengerData = challengersData[challengerArrayId];
      }

      const summonerPuuidResponse = await axios.get<RiotAPISummonerDto>(
        `https://euw1.api.riotgames.com/tft/summoner/v1/summoners/${challengerData['summonerId']}`
      );

      const summonerPuuid = summonerPuuidResponse.data.puuid;

      const matchesIdResponse =
        await axios.get(`https://europe.api.riotgames.com/tft/match/v1/matches/by-puuid/${summonerPuuid}/ids?start=0&count=10
`);

      const matchesId: Array<string> = matchesIdResponse.data;
      for (const matchId of matchesId) {
        const matchDataResponse = await axios
          .get<RiotAPIMatchDto>(
            `https://europe.api.riotgames.com/tft/match/v1/matches/${matchId}`
          )
          .catch(
            async (e) =>
              await axios.get<RiotAPIMatchDto>(
                `https://europe.api.riotgames.com/tft/match/v1/matches/${matchId}`
              )
          );

        const matchData = matchDataResponse.data;

        const participants = matchData.info.participants;

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
          saveTotalNumberOfMatches(totalNumberOfMatches, numberOfComps);
          calculateAndSaveUnitsDataIntoDb(unitsObject);
          calculateAndSaveItemsDataIntoDb(itemsObject);
          calculateAndSaveAugmentsDataIntoDb(
            augmentsObject,
            firstChoiceAugmentObject,
            secondChoiceAugmentObject,
            thirdChoiceAugmentObject
          );
          return;
        }
      }
    }
  } catch (e: any) {
    console.log(e.message);
  }
};

export default collectDataAboutRankings;
