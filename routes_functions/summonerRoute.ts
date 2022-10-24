import getPreviousMatchesData from '../helper_functions/summonerRoute/getPreviousMatchesData.js';
import getFullNameOfRegion from '../helper_functions/summonerRoute/getFullNameOfRegion.js';
import getDetailedLeagueInfoData from '../helper_functions/summonerRoute/getDetailedLeagueInfoData.js';
import axios from 'axios';
import NodeCache from 'node-cache';
import timeSince from '../helper_functions/summonerRoute/timeSince.js';

const myCache = new NodeCache();

const getSummonersData = async (name: string, region: string) => {
  const requestObject = { totalRequest: 0, currentRequest: 0 };
  try {
    const summonerDataResponse = await axios.get(
      encodeURI(
        `https://${region}.api.riotgames.com/tft/summoner/v1/summoners/by-name/${name}`
      )
    );

    const summonerData: Object = summonerDataResponse.data;
    const id: string = summonerData['id'];

    const puuid: string = summonerData['puuid'];
    const iconId: string = summonerData['profileIconId'];
    const riotName: string = summonerData['name'];

    const summonerLeagueResponse = await axios.get(
      `https://${region}.api.riotgames.com/tft/league/v1/entries/by-summoner/${id}`
    );

    const summonerLeague = summonerLeagueResponse.data[0];
    const top4Overall = summonerLeague['wins'];

    const gamesOverall = top4Overall + summonerLeague['losses'];

    let numberOfNotCachedMatches: number;
    const cacheResult: Object | undefined = myCache.get(id);
    const isPlayerCached = cacheResult != undefined;
    if (isPlayerCached && cacheResult['stats']['gamesPlayed'] == gamesOverall) {
      for (const match of cacheResult['matches']) {
        match['timeAgo'] = timeSince(match['matchTime']);
      }
      return myCache.get(id);
    }

    if (isPlayerCached) {
      numberOfNotCachedMatches =
        gamesOverall - cacheResult['stats']['gamesPlayed'];
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
    let last20MatchesData;
    if (isPlayerCached) {
      last20MatchesData = await getPreviousMatchesData(
        puuid,
        region,
        requestObject,
        false,
        numberOfNotCachedMatches!
      );
    } else {
      last20MatchesData = await getPreviousMatchesData(
        puuid,
        region,
        requestObject,
        false
      );
    }

    let last20MatchesStats;

    let last20Matches: Array<Object>;
    if (!isPlayerCached) {
      last20Matches = last20MatchesData[1];
      last20MatchesStats = last20MatchesData[0];
    } else {
      const excessedPastMatches = cacheResult['last20']['placements'].slice(
        numberOfNotCachedMatches! * -1
      );
      let currentNumberOfWins = cacheResult['last20']['wins'];
      let currentNumberOfTop4 = cacheResult['last20']['top4Placements'];
      let currentSumOfPlacement = cacheResult['last20']['sumOfPlacements'];
      for (const value of excessedPastMatches) {
        currentSumOfPlacement -= value;
        if (value <= 4) {
          currentNumberOfTop4--;
          if (value == 1) {
            currentNumberOfWins--;
          }
        }
      }
      currentNumberOfWins += last20MatchesData[0]['wins'];
      currentNumberOfTop4 += last20MatchesData[0]['top4Placements'];
      currentSumOfPlacement += last20MatchesData[0]['sumOfPlacements'];

      const placements = last20MatchesData[0]['placements']
        .concat(cacheResult['last20']['placements'])
        .slice(0, 20);

      const numberOfGames = placements.length;

      const avgPlacement20 = (currentSumOfPlacement / numberOfGames).toFixed(2);
      const winsPercent20 = (
        (currentNumberOfWins / numberOfGames) *
        100
      ).toFixed(2);
      const top4Percent20 = (
        (currentNumberOfTop4 / numberOfGames) *
        100
      ).toFixed(2);

      last20MatchesStats = {
        winsProcentage: winsPercent20,
        top4Procentage: top4Percent20,
        avgPlacement: avgPlacement20,
        placements: placements,
        wins: currentNumberOfWins,
        top4Placements: currentNumberOfTop4,
        sumOfPlacements: currentSumOfPlacement
      };
      for (
        let i = 0;
        i < cacheResult['matches'].length - numberOfNotCachedMatches!;
        i++
      ) {
        cacheResult['matches'][i]['timeAgo'] = timeSince(
          cacheResult['matches'][i]['matchTime']
        );
      }
      last20Matches = last20MatchesData[1].concat(cacheResult['matches']);
      last20Matches = last20Matches.slice(0, 20);
    }

    let totalMatchesData: Object;
    if (!isPlayerCached) {
      totalMatchesData = await getPreviousMatchesData(
        puuid,
        region,
        requestObject,
        true,
        gamesOverall
      );
    }
    const top = (((leagueInfo + 1) / 252500) * 100).toFixed(3);
    const profile = {
      name: riotName,
      region: getFullNameOfRegion(region),
      icon: iconId,
      rank: `${tier}${
        tier === 'MASTER' || tier === 'GRANDMASTER' || tier === 'CHALLENGER'
          ? ''
          : ` ${division}`
      }`,
      lp: lp,
      ranking: leagueInfo + 1,
      top: top
    };

    let stats;
    if (!isPlayerCached) {
      stats = {
        top4: top4Overall,
        top4Percent: top4Procentage,
        wins: totalMatchesData!['wins'],
        winsPercent: totalMatchesData!['winsProcentage'],
        avgPlacement: totalMatchesData!['avgPlacement']!,
        gamesPlayed: gamesOverall,
        sumOfPlacements: totalMatchesData!['sumOfPlacements']
      };
    } else {
      const wins = last20MatchesData[0]['wins'] + cacheResult['stats']['wins'];
      const winsPercent = ((wins / gamesOverall) * 100).toFixed(2);
      const sumOfPlacements =
        cacheResult['stats']['sumOfPlacements'] +
        last20MatchesData[0]['sumOfPlacements'];
      const avgPlacement = (sumOfPlacements / gamesOverall).toFixed(2);
      stats = {
        top4: top4Overall,
        top4Percent: top4Procentage,
        wins: wins,
        winsPercent: winsPercent,
        avgPlacement: avgPlacement,
        gamesPlayed: gamesOverall,
        sumOfPlacements: sumOfPlacements
      };
    }

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
