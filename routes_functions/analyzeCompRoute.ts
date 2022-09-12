import { prisma } from '@prisma/client';
import axios from 'axios';

const findMatchingComposition = async (
  inputData: Array<any>,
  sampleSize: number
) => {
  try {
    const result = {
      augments: [],
      items: [],
      variation: { top4Ratio: 0, avgPlacement: 0 }
    };
    const challengerDataResponse = await axios.get(
      `https://euw1.api.riotgames.com/tft/league/v1/challenger?api_key=${process.env.API_KEY}`
    );
    let placementOverall = 0;
    let top4Count = 0;

    const challengersData: Array<any> = challengerDataResponse.data['entries'];
    let numberOfMatchingComps = 0;

    for (const challengerData of challengersData) {
      const summonerPuuidResponse = await axios.get(
        `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/${challengerData['summonerId']}?api_key=${process.env.API_KEY}`
      );
      const summonerPuuid: string = summonerPuuidResponse.data['puuid'];

      const matchesIdResponse =
        await axios.get(`https://europe.api.riotgames.com/tft/match/v1/matches/by-puuid/${summonerPuuid}/ids?start=0&count=30&api_key=${process.env.API_KEY}
`);
      const matchesId: Array<string> = matchesIdResponse.data;
      let totalNumberOfMatches = 0;
      for (const matchId of matchesId) {
        const matchDataResponse = await axios.get(
          `https://europe.api.riotgames.com/tft/match/v1/matches/${matchId}?api_key=${process.env.API_KEY}`
        );

        const matchData: Object = matchDataResponse.data;

        const participants = matchData['participants'];

        let isCompositionMatchingInput = true;

        for (const composition of participants) {
          const compositionUnits = composition['units'].reduce(
            (object: Object, item: Object) => {
              const name = item['character_id'];
              object[name] = {
                level: item['tier'],
                items: item['items']
              };

              return object;
            },
            {}
          );

          for (const unit of inputData) {
            const unitIndex = Object.keys(compositionUnits).indexOf(
              unit['character_id']
            );
            if (unitIndex == -1) {
              isCompositionMatchingInput = false;
              break;
            } else {
              if (
                compositionUnits[unit['character_id']]['level'] !=
                unit['isLevel3']
              ) {
                isCompositionMatchingInput = false;
                break;
              }
              const items: Array<number> = unit['items']['id'];
              if (
                !items.every((item) => {
                  return compositionUnits[unit['character_id']][
                    'items'
                  ].indexOf(item);
                })
              ) {
                isCompositionMatchingInput = false;
                break;
              }
            }
          }
          if (isCompositionMatchingInput) {
            numberOfMatchingComps++;
            placementOverall += composition['placement'];
            if (composition['placement'] <= 4) {
              top4Count++;
            }
            analyzeCompositionAugments(composition, result);
          }
          if (numberOfMatchingComps == sampleSize) {
            const top4Procentage = (
              (top4Count / totalNumberOfMatches) *
              100
            ).toFixed(2);

            const avgPlacement = (
              placementOverall / totalNumberOfMatches
            ).toFixed(2);

            result['variation']['top4Ratio'] = parseInt(top4Procentage);
            result['variation']['avgPlacement'] = parseInt(avgPlacement);

            return result;
          }
        }
        if (isCompositionMatchingInput) {
          totalNumberOfMatches++;
        }
      }
      return result;
    }
  } catch (error: any) {
    console.log(error.message);
  }
};

const analyzeCompositionAugments = (composition: Object, result: Object) => {
  for (const augment of composition['augments']) {
    // ADD CHECKING IN DATABASE AUGMENT AND IF IT IS NOT THERE ADD IT TO THE LIST!!!
    result['augments'][augment]++;
  }
};
