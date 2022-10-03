import axios from 'axios';
import timeSince from './timeSince.js';
import mapTraits from './mapTraits.js';
import mapUnits from './mapUnits.js';
import getMatchRegion from './getMatchRegion.js';

const getPreviousMatchesData = async (
  puuid: string,
  count: number,
  region: string,
  generalData?: boolean
) => {
  const matchRegion = getMatchRegion(region);

  const matchesIdResponse = await axios.get(
    `https://${matchRegion}.api.riotgames.com/tft/match/v1/matches/by-puuid/${puuid}/ids?start=0&count=${count}`
  );
  const matchesId = matchesIdResponse.data;
  const placements = [];

  let sumOfPlacements = 0;
  let top4Placements = 0;
  let wins = 0;
  const allComps = [];

  for (const matchId of matchesId) {
    const matchDataResponse = await axios.get(
      `https://${matchRegion}.api.riotgames.com/tft/match/v1/matches/${matchId}`
    );
    const matchData = matchDataResponse.data;
    const participants: Array<any> = matchData['info']['participants'];
    const playerIndex = matchData['metadata']['participants'].indexOf(puuid);

    const playerInfo = participants[playerIndex];

    const placement = playerInfo['placement'];

    if (!generalData) {
      const otherCompositions = await Promise.all(
        participants.map(async (item) => {
          let eliminated;
          const summonerResponse = await axios.get(
            `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${item['puuid']}`
          );
          const name = summonerResponse.data['name'];
          const summonerIcon = summonerResponse.data['profileIconId'];
          if (item['last_round'] <= 3) {
            eliminated = `1-${item['last_round']}`;
          } else {
            eliminated = `${1 + Math.ceil((item['last_round'] - 3) / 7)}-${
              (item['last_round'] - 3) % 7 == 0
                ? 7
                : (item['last_round'] - 3) % 7
            }`;
          }
          const result = {
            augments: item['augments'],
            goldLeft: item['gold_left'],
            placement: item['placement'],
            traits: mapTraits(item['traits']),
            units: mapUnits(item['units']),
            eliminated: eliminated,
            summonerName: name,
            summonerIcon: summonerIcon
          };
          return result;
        })
      );
      otherCompositions.sort((a, b) => {
        if (a['placement'] < b['placement']) {
          return -1;
        }
        if (a['placement'] < b['placement']) {
          return 1;
        }
        return 0;
      });
      const match = {
        players: otherCompositions,
        timeAgo: timeSince(matchData['info']['game_datetime']),
        queueType:
          matchData['info']['tft_game_type'] === 'standard'
            ? 'Ranked'
            : 'Normal',
        placement: placement,
        trait: mapTraits(playerInfo['traits']),
        units: mapUnits(playerInfo['units']),
        augments: playerInfo['augments']
      };
      allComps.push(match);
    }
    sumOfPlacements += placement;
    if (placement <= 4) {
      top4Placements++;
    }
    if (placement == 1) {
      wins++;
    }
    if (!generalData) {
      placements.push(placement);
    }
  }
  const winsProcentage = ((wins / count) * 100).toFixed(2);
  const top4Procentage = ((top4Placements / count) * 100).toFixed(2);
  const avgPlacement = (sumOfPlacements / count).toFixed(2);

  let result = {};
  if (!generalData) {
    result = {
      winsProcentage: winsProcentage,
      top4Procentage: top4Procentage,
      avgPlacement: avgPlacement,
      placements: placements,
      wins: wins,
      top4Placements: top4Placements
    };
    return [result, allComps];
  } else {
    result = {
      winsProcentage: winsProcentage,
      avgPlacement: avgPlacement,
      wins: wins
    };
    return result;
  }
};

export default getPreviousMatchesData;
