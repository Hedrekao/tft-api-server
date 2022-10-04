import getPreviousMatchesData from '../helper_functions/summonerRoute/getPreviousMatchesData.js';
import getFullNameOfRegion from '../helper_functions/summonerRoute/getFullNameOfRegion.js';
import getDetailedLeagueInfoData from '../helper_functions/summonerRoute/getDetailedLeagueInfoData.js';
import axios from 'axios';

const getSummonersData = async (name: string, region: string) => {
  try {
    const summonerDataResponse = await axios.get(
      encodeURI(
        `https://${region}.api.riotgames.com/tft/summoner/v1/summoners/by-name/${name}`
      )
    );
    const summonerData: Object = summonerDataResponse.data;
    const puuid: string = summonerData['puuid'];
    const id: string = summonerData['id'];
    const iconId: string = summonerData['profileIconId'];

    const summonerLeagueResponse = await axios.get(
      `https://${region}.api.riotgames.com/tft/league/v1/entries/by-summoner/${id}`
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
      3,
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
    return result;
  } catch (error: any) {
    console.log('wtf');
    return { error: `error - ${error.message}` };
  }
};

export default getSummonersData;
