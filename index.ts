import fastify, { RequestParamsDefault } from 'fastify';
import dotenv from 'dotenv';
import sensible from '@fastify/sensible';
import { PrismaClient } from '@prisma/client';
import cors from '@fastify/cors';
import axios from 'axios';

dotenv.config();

const app = fastify();
app.register(sensible);
app.register(cors);
const prisma = new PrismaClient();

const getSummonersData = async (name: string, region: string) => {
  try {
    name = name.replaceAll(' ', '%20');
    const summonerDataResponse = await axios.get(
      `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}?api_key=${process.env.API_KEY}`
    );
    const summonerData = summonerDataResponse.data;
    const puuid = summonerData['puuid'];
    const id = summonerData['id'];

    const summonerLeagueResponse = await axios.get(
      `https://${region}.api.riotgames.com/tft/league/v1/entries/by-summoner/${id}?api_key=${process.env.API_KEY}`
    );

    const summonerLeague = summonerLeagueResponse.data[0];

    console.log(summonerLeague);
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

    // const totalMatchesData = await getPreviousMatchesData(
    //   puuid,
    //   gamesOverall,
    //   true
    // );

    const result = {
      last20MatchesData: last20MatchesData,
      lp: lp,
      tier: tier,
      division: division,
      top4Overall: top4Overall,
      top4Procentage: top4Procentage,
      gamesOverall: gamesOverall,
      // totalMatchesData: totalMatchesData,
      rankingPosition: leagueInfo + 1
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
      const otherCompositions = await Promise.all(
        participants.map(async (item) => {
          if (item['puuid'] != puuid) {
            let eliminated;
            const nameResponse = await axios.get(
              `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${item['puuid']}?api_key=${process.env.API_KEY}`
            );
            const name = nameResponse.data['name'];
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
              traits: item['traits'],
              units: item['units'],
              eliminated: eliminated,
              name: name
            };
            return result;
          }
        })
      );
      const comps = {
        playerComposition: playerInfo,
        otherCompositions: otherCompositions,
        playedOn: new Date(
          matchData['info']['game_datetime'] * 1000
        ).toUTCString()
      };
      allComps.push(comps);
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

  const result = {
    winsProcentage: winsProcentage,
    top4Procentage: top4Procentage,
    avgPlacement: avgPlacement,
    placements: placements,
    wins: wins,
    top4Placements: top4Placements,
    comps: allComps
  };
  return result;
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

const findMatchingComposition = async (inputData: Array<any>) => {
  try {
    const result = [];
    const challengerDataResponse = await axios.get(
      `https://euw1.api.riotgames.com/tft/league/v1/challenger?api_key=${process.env.API_KEY}`
    );

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
      let totalNumberOfMatches = 0;
      for (const matchId of matchesId) {
        const matchDataResponse = await axios.get(
          `https://europe.api.riotgames.com/tft/match/v1/matches/${matchId}?api_key=${process.env.API_KEY}`
        );

        const matchData: Object = matchDataResponse.data;

        const participants = matchData['participants'];

        for (const composition of participants) {
          let isCompositionMatchingInput = true;

          const compositionUnits = composition['units'].reduce(
            (object: Object, item: Object) => {
              const name = item['character_id'];
              object[name] = {
                name: {
                  level: item['tier'],
                  items: item['items']
                }
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
              const items: Array<number> = unit['items'];
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
            totalNumberOfMatches++;
            // analyzeComposition(composition) // TO DO!!
          }
        }

        result.push(matchData);
      }
      return result;
    }
  } catch (error: any) {
    console.log(error.message);
  }
};

app.get('/comps', async (req, res) => {
  // return findMatchingComposition('baginski');
});

app.get('/summoner/:region/name', async (req: any, res) => {
  return getSummonersData(req.params.name, req.params.region);
});

app.listen({ port: process.env.PORT }, (err) => {
  console.log('Server is running');
});

async function commitToDb(promise: Promise<any>) {
  const [error, data] = await app.to(promise);

  if (error) return app.httpErrors.internalServerError(error.message);
  return data;
}
