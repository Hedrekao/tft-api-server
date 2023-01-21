import axios from 'axios';
import getFullNameOfRegion from '../helper_functions/summonerRoute/getFullNameOfRegion.js';

const getSummonerBasicData = async (
  region: string,
  name: string
): Promise<
  | {
      summonerName: string;
      region: string;
      rank: string;
      lp: string;
      iconUrl: string;
    }
  | undefined
> => {
  try {
    const summonerDataResponse = await axios.get<RiotAPISummonerDto>(
      encodeURI(
        `https://${region}.api.riotgames.com/tft/summoner/v1/summoners/by-name/${name}`
      )
    );

    const summonerData = summonerDataResponse!.data;
    const id = summonerData.id;

    const iconId = summonerData.profileIconId;
    const summonerName: string = summonerData.name;

    const summonerLeagueResponse = await axios.get<RiotAPISummonerLeague[]>(
      `https://${region}.api.riotgames.com/tft/league/v1/entries/by-summoner/${id}`
    );

    const summonerLeague = summonerLeagueResponse.data[0];
    const lp = summonerLeague.leaguePoints;
    const tier = summonerLeague.tier;
    const division = summonerLeague.rank;

    const result = {
      summonerName: summonerName,
      region: getFullNameOfRegion(region) as string,
      rank: `${tier}${
        tier == 'MASTER' || tier == 'GRANDMASTER' || tier == 'CHALLENGER'
          ? ''
          : ' ' + division
      }`,
      lp: `${lp} LP`,
      iconUrl: `https://raw.communitydragon.org/latest/game/assets/ux/summonericons/profileicon${iconId}.png`
    };
    return result;
  } catch (e) {
    console.log(1);
    return undefined;
  }
};

export default getSummonerBasicData;
