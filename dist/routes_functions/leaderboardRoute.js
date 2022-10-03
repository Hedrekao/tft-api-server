import axios from 'axios';
const getLeaderboardData = async (region, maxNumber) => {
    const leagueResponse = await axios.get(`https://${region}.api.riotgames.com/tft/league/v1/challenger`);
    const leagueResponseData = leagueResponse.data;
    let count = 0; // dev
    const leaderboard = [];
    for (const entry of leagueResponseData['entries']) {
        count++; // dev
        const lp = entry['leaguePoints'];
        const tier = entry['tier'];
        const top4Overall = entry['wins'];
        const gamesOverall = top4Overall + entry['losses'];
        const name = entry['summonerName'];
        const summonerInfoResponse = await axios.get(`https://${region}.api.riotgames.com/lol/summoner/v4/summoners/${entry['summonerId']}`);
        const top4Procentage = ((top4Overall / gamesOverall) * 100).toFixed(2);
        const puuid = summonerInfoResponse.data['puuid'];
        const profileIconId = summonerInfoResponse.data['profileIconId'];
        // const totalMatchesData = await getPreviousMatchesData(
        //   puuid,
        //   gamesOverall,
        //   region,
        //   true
        // );
        const player = {
            profileIcon: profileIconId,
            name: name,
            rank: 'Challenger',
            lp: lp,
            avgPlace: 8,
            winrate: 32,
            top4Ratio: top4Procentage,
            gamesOverall: gamesOverall
        };
        leaderboard.push(player);
        if (count == maxNumber) {
            //dev
            leaderboard.sort((a, b) => {
                if (a['lp'] > b['lp']) {
                    return -1;
                }
                if (a['lp'] < b['lp']) {
                    return 1;
                }
                return 0;
            });
            return leaderboard;
        }
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
    return leaderboard;
};
export default getLeaderboardData;
