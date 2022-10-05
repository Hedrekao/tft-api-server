import getPreviousMatchesData from '../helper_functions/summonerRoute/getPreviousMatchesData.js';
import getFullNameOfRegion from '../helper_functions/summonerRoute/getFullNameOfRegion.js';
import getDetailedLeagueInfoData from '../helper_functions/summonerRoute/getDetailedLeagueInfoData.js';
import axios from 'axios';
import NodeCache from 'node-cache';

const myCache = new NodeCache();

const getSummonersData = async (name: string, region: string) => {
  const requestObject = { totalRequest: 0, currentRequest: 0 };
  try {
    const summonerDataResponse = await axios.get(
      encodeURI(
        `https://${region}.api.riotgames.com/tft/summoner/v1/summoners/by-name/${name}`
      )
    );
    requestObject.totalRequest++;
    requestObject.currentRequest++;
    const summonerData: Object = summonerDataResponse.data;
    const id: string = summonerData['id'];

    const puuid: string = summonerData['puuid'];
    const iconId: string = summonerData['profileIconId'];

    const summonerLeagueResponse = await axios.get(
      `https://${region}.api.riotgames.com/tft/league/v1/entries/by-summoner/${id}`
    );
    requestObject.totalRequest++;
    requestObject.currentRequest++;
    const summonerLeague = summonerLeagueResponse.data[0];
    const top4Overall = summonerLeague['wins'];

    const gamesOverall = top4Overall + summonerLeague['losses'];

    const cacheResult: Object | undefined = myCache.get(id);
    if (
      cacheResult != undefined &&
      cacheResult['stats']['gamesPlayed'] == gamesOverall
    ) {
      return myCache.get(id);
    }

    const lp = summonerLeague['leaguePoints'];
    const tier = summonerLeague['tier'];
    const division = summonerLeague['rank'];

    const leagueInfo = await getDetailedLeagueInfoData(
      id,
      tier,
      region,
      division,
      lp,
      requestObject
    );

    const top4Procentage = ((top4Overall / gamesOverall) * 100).toFixed(2);

    const last20MatchesData = await getPreviousMatchesData(
      puuid,
      region,
      requestObject,
      false
    );

    const last20MatchesStats = last20MatchesData[0];

    const last20Matches = last20MatchesData[1];

    // const totalMatchesData = await getPreviousMatchesData(
    //   puuid,
    //   region,
    //   requestObject,
    //   true,
    // gamesOverall,
    // );

    const profile = {
      name: name,
      region: getFullNameOfRegion(region),
      icon: iconId,
      rank: `${tier}${
        tier === 'MASTER' || tier === 'GRANDMASTER' || tier === 'CHALLENGER'
          ? ''
          : ` ${division}`
      }`,
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
    myCache.set(id, result);
    return result;
  } catch (error: any) {
    console.log('wtf');
    return { error: `error - ${error.message}` };
  }
};

export default getSummonersData;
