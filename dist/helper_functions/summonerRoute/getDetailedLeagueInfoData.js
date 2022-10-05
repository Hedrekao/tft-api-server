import axios from 'axios';
import sleep from '../sleep.js';
const getDetailedLeagueInfoData = async (id, tier, region, division, lp, requestObject) => {
    let peopleWithHigherLp = 0;
    const startingTier = tier;
    const startingDivision = division;
    if (tier == 'CHALLENGER' || tier == 'MASTER' || tier == 'GRANDMASTER') {
        const leagueResponse = await axios.get(`https://${region}.api.riotgames.com/tft/league/v1/${tier.toLowerCase()}
      `);
        requestObject['totalRequest']++;
        requestObject['currentRequest']++;
        const leagueData = leagueResponse.data;
        for (const entry of leagueData['entries']) {
            if (entry['id'] != id && entry['leaguePoints'] > lp) {
                peopleWithHigherLp++;
            }
        }
        if (tier == 'MASTER') {
            const grandmasterResponse = await axios.get(`https://${region}.api.riotgames.com/tft/league/v1/grandmaster`);
            requestObject['totalRequest']++;
            requestObject['currentRequest']++;
            peopleWithHigherLp += grandmasterResponse.data['entries'].length;
            const challengerResponse = await axios.get(`https://${region}.api.riotgames.com/tft/league/v1/challenger`);
            requestObject['totalRequest']++;
            requestObject['currentRequest']++;
            peopleWithHigherLp += challengerResponse.data['entries'].length;
        }
        if (tier == 'GRANDMASTER') {
            const challengerResponse = await axios.get(`https://${region}.api.riotgames.com/tft/league/v1/challenger`);
            requestObject['totalRequest']++;
            requestObject['currentRequest']++;
            peopleWithHigherLp += challengerResponse.data['entries'].length;
        }
    }
    else {
        const challengerResponse = await axios.get(`https://${region}.api.riotgames.com/tft/league/v1/challenger`);
        requestObject['totalRequest']++;
        requestObject['currentRequest']++;
        peopleWithHigherLp += challengerResponse.data['entries'].length;
        const grandmasterResponse = await axios.get(`https://${region}.api.riotgames.com/tft/league/v1/grandmaster`);
        requestObject['totalRequest']++;
        requestObject['currentRequest']++;
        peopleWithHigherLp += grandmasterResponse.data['entries'].length;
        const masterResponse = await axios.get(`https://${region}.api.riotgames.com/tft/league/v1/master`);
        requestObject['totalRequest']++;
        requestObject['currentRequest']++;
        peopleWithHigherLp += masterResponse.data['entries'].length;
        let isFinished = false;
        let pageCount = 1;
        do {
            let currentLeagueResponse = await axios.get(`https://${region}.api.riotgames.com/tft/league/v1/entries/${tier}/${division}?page=${pageCount}`);
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
                }
                else {
                    peopleWithHigherLp += currentLeague.length;
                }
                pageCount++;
            }
            else {
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
                }
                else {
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
export default getDetailedLeagueInfoData;