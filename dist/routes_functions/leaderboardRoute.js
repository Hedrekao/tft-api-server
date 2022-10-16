import axios from 'axios';
import NodeCache from 'node-cache';
const myCache = new NodeCache();
const getLeaderboardData = async (region, maxNumber) => {
    if (myCache.get(`leaderboard-${region}`) != undefined) {
        return myCache.get(`leaderboard-${region}`);
    }
    const leagueResponse = await axios.get(`https://${region}.api.riotgames.com/tft/league/v1/challenger`);
    const leagueResponseData = leagueResponse.data;
    let leaderboard = [];
    for (const entry of leagueResponseData['entries']) {
        const lp = entry['leaguePoints'];
        const top4Overall = entry['wins'];
        const gamesOverall = top4Overall + entry['losses'];
        const name = entry['summonerName'];
        const top4Procentage = ((top4Overall / gamesOverall) * 100).toFixed(2);
        const player = {
            profileIcon: entry['summonerId'],
            name: name,
            rank: 'Challenger',
            lp: lp,
            top4Ratio: top4Procentage,
            gamesOverall: gamesOverall
        };
        leaderboard.push(player);
    }
    leaderboard.sort((a, b) => {
        if (a['lp'] > b['lp']) {
            return -1;
        }
        if (a['lp'] < b['lp']) {
            return 1;
        }
        return 0;
    });
    for (const player of leaderboard) {
        const summonerInfoResponse = await axios.get(`https://${region}.api.riotgames.com/tft/summoner/v1/summoners/${player.profileIcon}`);
        const profileIconId = summonerInfoResponse.data['profileIconId'];
        player.profileIcon = profileIconId;
    }
    myCache.set(`leaderboard-${region}`, leaderboard, 10800);
    return leaderboard;
};
export default getLeaderboardData;
