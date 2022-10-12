import axios from 'axios';
import sleep from '../sleep.js';

const getDetailedLeagueInfoData = async (
  id: string,
  tier: string,
  region: string,
  division: string,
  lp: number,
  requestObject: Object
) => {
  let peopleWithHigherLp = 0;
  const startingTier = tier;
  const startingDivision = division;

  if (tier == 'CHALLENGER' || tier == 'MASTER' || tier == 'GRANDMASTER') {
    const leagueResponse = await axios.get(
      `https://${region}.api.riotgames.com/tft/league/v1/${tier.toLowerCase()}
      `
    );

    requestObject['totalRequest']++;
    requestObject['currentRequest']++;
    const leagueData = leagueResponse.data;
    for (const entry of leagueData['entries']) {
      if (entry['id'] != id && entry['leaguePoints'] > lp) {
        peopleWithHigherLp++;
      }
    }
    if (tier == 'MASTER') {
      const grandmasterResponse = await axios.get(
        `https://${region}.api.riotgames.com/tft/league/v1/grandmaster`
      );
      requestObject['totalRequest']++;
      requestObject['currentRequest']++;
      peopleWithHigherLp += grandmasterResponse.data['entries'].length;

      const challengerResponse = await axios.get(
        `https://${region}.api.riotgames.com/tft/league/v1/challenger`
      );
      requestObject['totalRequest']++;
      requestObject['currentRequest']++;
      peopleWithHigherLp += challengerResponse.data['entries'].length;
    }
    if (tier == 'GRANDMASTER') {
      const challengerResponse = await axios.get(
        `https://${region}.api.riotgames.com/tft/league/v1/challenger`
      );
      requestObject['totalRequest']++;
      requestObject['currentRequest']++;
      peopleWithHigherLp += challengerResponse.data['entries'].length;
    }
  } else if (
    tier == 'DIAMOND' &&
    (division == 'I' || division == 'II' || division == 'III')
  ) {
    const challengerResponse = await axios.get(
      `https://${region}.api.riotgames.com/tft/league/v1/challenger`
    );
    requestObject['totalRequest']++;
    requestObject['currentRequest']++;
    peopleWithHigherLp += challengerResponse.data['entries'].length;

    const grandmasterResponse = await axios.get(
      `https://${region}.api.riotgames.com/tft/league/v1/grandmaster`
    );
    requestObject['totalRequest']++;
    requestObject['currentRequest']++;
    peopleWithHigherLp += grandmasterResponse.data['entries'].length;

    const masterResponse = await axios.get(
      `https://${region}.api.riotgames.com/tft/league/v1/master`
    );
    requestObject['totalRequest']++;
    requestObject['currentRequest']++;

    peopleWithHigherLp += masterResponse.data['entries'].length;

    let isFinished = false;
    let pageCount = 1;
    do {
      let currentLeagueResponse = await axios.get(
        `https://${region}.api.riotgames.com/tft/league/v1/entries/${tier}/${division}?page=${pageCount}`
      );
      requestObject['totalRequest']++;
      requestObject['currentRequest']++;
      if (requestObject['currentRequest'] == 19) {
        await sleep(1000);
        requestObject['currentRequest'] = 0;
      }
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
  } else {
    const rank = `${tier} ${division}`;
    switch (rank) {
      case 'DIAMOND IV':
        return 16000;
      case 'PLATINUM I':
        return 23700;
      case 'PLATINUM II':
        return 26200;
      case 'PLATINUM III':
        return 32100;
      case 'PLATINUM IV':
        return 41300;
      case 'GOLD I':
        return 59000;
      case 'GOLD II':
        console.log('xd');
        return 66800;
      case 'GOLD III':
        return 81800;
      case 'GOLD IV':
        return 102500;
      case 'SILVER I':
        return 133600;
      case 'SILVER II':
        return 150500;
      case 'SILVER III':
        return 174500;
      case 'SILVER IV':
        return 197400;
      case 'BRONZE I':
        return 218400;
      case 'BRONZE II':
        return 228700;
      case 'BRONZE III':
        return 237700;
      case 'BRONZE IV':
        return 243800;
      case 'IRON I':
        return 247800;
      case 'IRON II':
        return 249900;
      case 'IRON III':
        return 251800;
      case 'IRON IV':
        return 252500;
    }
  }
  return peopleWithHigherLp;
};

export default getDetailedLeagueInfoData;
