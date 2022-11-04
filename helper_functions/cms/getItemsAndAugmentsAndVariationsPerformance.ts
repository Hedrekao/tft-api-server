import { Comp, Variation } from '../../types/classes.js';
import axios from 'axios';
import transformUnitsData from '../analyzeRoute/transformUnitsData.js';
import collectDataAboutItemsCMS from './collectDataAboutItemsCMS.js';
import createItemsRates from './createItemsRates.js';
import isCompositionMatchingInputCMS from './isCompositionMatchingInputCMS.js';
import collectDataAboutAugments from '../analyzeRoute/collectDataAboutAugments.js';
import collectDataAboutVariation from './collectDataAboutVariation.js';
import analyzeCompositionAugments from './analyzeCompositionAugments.js';
import analyzeVariationPerformance from './analyzeVariationPerformance.js';
import sleep from '../sleep.js';
import analyzeAugments from 'helper_functions/analyzeRoute/analyzeAugments.js';

const find4MostFrequentItemsOnCoreUnits = async (compositionInput: Comp) => {
  try {
    const challengerDataResponse = await axios.get(
      `https://euw1.api.riotgames.com/tft/league/v1/challenger`
    );

    let numberOfMatchingComps = 0;
    let totalNumberOfMatches = 0;
    let numberOfAugmentMatchingComps = 0;
    let totalNumberOfMatchesOverall = 0;

    const itemsData = {};
    const augmentData = {};
    const variationPerformance: any = [];

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
        const matchDataResponse = await axios.get(
          `https://europe.api.riotgames.com/tft/match/v1/matches/${matchId}`
        );

        const matchData: Object = matchDataResponse.data;
        let firstCompositionInMatch = true;

        const participants = matchData['info']['participants'];

        for (const composition of participants) {
          const compositionUnits = transformUnitsData(composition['units']);

          const isMatchForAugmentCheck = isCompositionMatchingInputCMS(
            compositionInput,
            compositionUnits
          );

          if (isMatchForAugmentCheck) {
            collectDataAboutAugments(composition, augmentData);
            numberOfAugmentMatchingComps++;
          }

          for (const [
            index,
            variation
          ] of compositionInput.variations.entries()) {
            const isMatchForVariationCheck = isCompositionMatchingInputCMS(
              variation,
              compositionUnits
            );
            if (typeof variationPerformance[index] != 'object') {
              variationPerformance[index] = {
                placementOverall: 0,
                top4Count: 0,
                numberOfComps: 0
              };
            }

            if (isMatchForVariationCheck) {
              collectDataAboutVariation(
                composition,
                variationPerformance[index]
              );
            }
          }

          numberOfMatchingComps++;

          if (firstCompositionInMatch) {
            totalNumberOfMatches++;
            firstCompositionInMatch = false;
          }

          collectDataAboutItemsCMS(
            itemsData,
            compositionUnits,
            compositionInput
          );
          // }
          if (totalNumberOfMatchesOverall == 1500 /* 500 */) {
            createItemsRates(
              compositionInput,
              numberOfMatchingComps,
              itemsData
            );
            analyzeCompositionAugments(
              augmentData,
              compositionInput,
              numberOfAugmentMatchingComps
            );
            for (const [
              index,
              variation
            ] of compositionInput.variations.entries()) {
              analyzeVariationPerformance(
                variation,
                variationPerformance[index]
              );
            }
            return;
          }
        }
        if (totalNumberOfMatchesOverall == 1500 /* 100 */) {
          createItemsRates(compositionInput, numberOfMatchingComps, itemsData);
          analyzeCompositionAugments(
            augmentData,
            compositionInput,
            numberOfAugmentMatchingComps
          );
          for (const [
            index,
            variation
          ] of compositionInput.variations.entries()) {
            analyzeVariationPerformance(variation, variationPerformance[index]);
          }

          return;
        }
        totalNumberOfMatchesOverall++;
      }
    }
  } catch (error: any) {
    console.log(error.message);
    return { error: `error - ${error.message}` };
  }
};

// 6 itemow kazdy unit w compie
export default find4MostFrequentItemsOnCoreUnits;
