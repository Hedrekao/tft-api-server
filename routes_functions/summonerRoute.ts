import timeSince from '../helper_functions/timeSince.js';
import mapTraits from '../helper_functions/mapTraits.js';
import mapUnits from '../helper_functions/mapUnits.js';
import axios from 'axios';

const getSummonersData = async (name: string, region: string) => {
  try {
    const transformedName = name.replaceAll(' ', '%20');
    const summonerDataResponse = await axios.get(
      `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${transformedName}?api_key=${process.env.API_KEY}`
    );
    const summonerData: Object = summonerDataResponse.data;
    const puuid: string = summonerData['puuid'];
    const id: string = summonerData['id'];
    const iconId: string = summonerData['profileIconId'];

    const summonerLeagueResponse = await axios.get(
      `https://${region}.api.riotgames.com/tft/league/v1/entries/by-summoner/${id}?api_key=${process.env.API_KEY}`
    );

    const summonerLeague = summonerLeagueResponse.data[0];

    const lp = summonerLeague['leaguePoints'];
    const tier = summonerLeague['tier'];
    const division = summonerLeague['rank'];
    const top4Overall = summonerLeague['wins'];
    const gamesOverall = top4Overall + summonerLeague['losses'];

    const leagueInfo = await getDetailedLeagueInfoData(
      id,
      tier,
      region,
      division,
      lp
    );

    const top4Procentage = ((top4Overall / gamesOverall) * 100).toFixed(2);

    const last20MatchesData = await getPreviousMatchesData(
      puuid,
      1,
      region,
      false
    );

    const last20MatchesStats = last20MatchesData[0];

    const last20Matches = last20MatchesData[1];

    // const totalMatchesData = await getPreviousMatchesData(
    //   puuid,
    //   gamesOverall,
    //   region,
    //   true
    // );

    const profile = {
      name: name,
      region: region,
      icon: iconId,
      rank: tier + ' ' + division,
      lp: lp,
      ranking: leagueInfo + 1
    };

    const stats = {
      top4: top4Overall,
      top4Percent: top4Procentage,
      // wins: totalMatchesData['wins'],
      // winsPercent: totalMatchesData['winsProcentage'],
      // avgPlacement: totalMatchesData['avgPlacement'],
      gamesPlayed: gamesOverall
    };

    const result = {
      last20: last20MatchesStats,
      stats: stats,
      profile: profile,
      matches: last20Matches
    };
    return result;
  } catch (error: any) {
    console.log('wtf');
    return error.message;
  }
};

const getPreviousMatchesData = async (
  puuid: string,
  count: number,
  region: string,
  generalData?: boolean
) => {
  const matchesIdResponse = await axios.get(
    `https://europe.api.riotgames.com/tft/match/v1/matches/by-puuid/${puuid}/ids?start=0&count=${count}&api_key=${process.env.API_KEY}`
  );
  const matchesId = matchesIdResponse.data;
  const placements = [];

  let sumOfPlacements = 0;
  let top4Placements = 0;
  let wins = 0;
  const allComps = [];

  for (const matchId of matchesId) {
    const matchDataResponse = await axios.get(
      `https://europe.api.riotgames.com/tft/match/v1/matches/${matchId}?api_key=${process.env.API_KEY}`
    );
    const matchData = matchDataResponse.data;
    const participants: Array<any> = matchData['info']['participants'];
    const playerIndex = matchData['metadata']['participants'].indexOf(puuid);

    const playerInfo = participants[playerIndex];

    const placement = playerInfo['placement'];

    if (!generalData) {
      const filteredParticipants = participants.filter((participant) => {
        return participant['puuid'] != playerInfo['puuid'];
      });
      const otherCompositions = await Promise.all(
        filteredParticipants.map(async (item) => {
          let eliminated;
          const summonerResponse = await axios.get(
            `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${item['puuid']}?api_key=${process.env.API_KEY}`
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
      const match = {
        players: otherCompositions,
        timeAgo: timeSince(matchData['info']['game_datetime']),
        queueType:
          matchData['info']['tft_game_type'] === 'standard'
            ? 'Ranked'
            : 'Normal',
        placement: placement,
        trait: mapTraits(playerInfo['traits']),
        units: mapUnits(playerInfo['units'])
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

const getDetailedLeagueInfoData = async (
  id: string,
  tier: string,
  region: string,
  division: string,
  lp: number
) => {
  let peopleWithHigherLp = 0;
  const startingTier = tier;
  const startingDivision = division;

  if (tier == 'CHALLENGER' || tier == 'MASTER' || tier == 'GRANDMASTER') {
    const leagueResponse = await axios.get(
      `https://${region}.api.riotgames.com/tft/league/v1/${tier.toLowerCase()}?api_key=${
        process.env.API_KEY
      }`
    );
    const leagueData = leagueResponse.data;
    for (const entry of leagueData['entries']) {
      if (entry['id'] != id && entry['leaguePoints'] > lp) {
        peopleWithHigherLp++;
      }
    }
    if (tier == 'MASTER') {
      const grandmasterResponse = await axios.get(
        `https://${region}.api.riotgames.com/tft/league/v1/grandmaster?api_key=${process.env.API_KEY}`
      );
      peopleWithHigherLp += grandmasterResponse.data['entries'].length;

      const challengerResponse = await axios.get(
        `https://${region}.api.riotgames.com/tft/league/v1/challenger?api_key=${process.env.API_KEY}`
      );
      peopleWithHigherLp += challengerResponse.data['entries'].length;
    }
    if (tier == 'GRANDMASTER') {
      const challengerResponse = await axios.get(
        `https://${region}.api.riotgames.com/tft/league/v1/challenger?api_key=${process.env.API_KEY}`
      );
      peopleWithHigherLp += challengerResponse.data['entries'].length;
    }
  } else {
    const challengerResponse = await axios.get(
      `https://${region}.api.riotgames.com/tft/league/v1/challenger?api_key=${process.env.API_KEY}`
    );
    peopleWithHigherLp += challengerResponse.data['entries'].length;

    const grandmasterResponse = await axios.get(
      `https://${region}.api.riotgames.com/tft/league/v1/grandmaster?api_key=${process.env.API_KEY}`
    );
    peopleWithHigherLp += grandmasterResponse.data['entries'].length;

    const masterResponse = await axios.get(
      `https://${region}.api.riotgames.com/tft/league/v1/master?api_key=${process.env.API_KEY}`
    );

    peopleWithHigherLp += masterResponse.data['entries'].length;

    let isFinished = false;
    let pageCount = 1;
    do {
      let currentLeagueResponse = await axios.get(
        `https://${region}.api.riotgames.com/tft/league/v1/entries/${tier}/${division}?page=${pageCount}&api_key=${process.env.API_KEY}`
      );
      let currentLeague = currentLeagueResponse.data;

      if (currentLeague.length != 0) {
        if (tier == startingTier && division == startingDivision) {
          for (const entry of currentLeague) {
            if (entry['leaguePoints'] > lp) {
              peopleWithHigherLp++;
            }
          }
        } else {
          peopleWithHigherLp += currentLeague.length;
        }
        pageCount++;
      } else {
        if (division != 'I') {
          switch (division) {
            case 'IV':
              division = 'III';
              break;
            case 'III':
              division = 'II';
              break;
            case 'II':
              division = 'I';
              break;
          }
        } else {
          switch (tier) {
            case 'Iron':
              tier = 'BRONZE';
              break;
            case 'BRONZE':
              tier = 'SILVER';
              break;
            case 'SILVER':
              tier = 'GOLD';
              break;
            case 'GOLD':
              tier = 'PLATINUM';
              break;
            case 'PLATINUM':
              tier = 'DIAMOND';
              break;
            case 'DIAMOND':
              isFinished = true;
              break;
          }
        }
        pageCount = 1;
      }
    } while (!isFinished);
  }

  return peopleWithHigherLp;
};

export default getSummonersData;
