import axios from 'axios';
import timeSince from './timeSince.js';
import mapTraits from './mapTraits.js';
import mapUnits from './mapUnits.js';
import getMatchRegion from './getMatchRegion.js';
import mapAugments from './mapAugments.js';
import { cache } from '../../helper_functions/singletonCache.js';
async function getPreviousMatchesData(puuid, region, requestObject, generalData, count) {
    const matchRegion = getMatchRegion(region);
    const dataDragon = cache.get('dataDragon');
    const matchesIdResponse = await axios.get(`https://${matchRegion}.api.riotgames.com/tft/match/v1/matches/by-puuid/${puuid}/ids?start=0&count=${count == undefined ? 20 : count}`);
    const matchesId = matchesIdResponse.data;
    const placements = [];
    let sumOfPlacements = 0;
    let top4Placements = 0;
    let wins = 0;
    let countOfGames = 0;
    const allComps = [];
    for (const matchId of matchesId) {
        const matchDataResponse = await axios
            .get(`https://${matchRegion}.api.riotgames.com/tft/match/v1/matches/${matchId}`)
            .catch(async (e) => await axios.get(`https://europe.api.riotgames.com/tft/match/v1/matches/${matchId}`));
        const matchData = matchDataResponse.data;
        if (matchData.info.tft_set_core_name == 'TFTSet8_2') {
            const participants = matchData.info.participants;
            const playerIndex = matchData.metadata.participants.indexOf(puuid);
            countOfGames++;
            const playerInfo = participants[playerIndex];
            const placement = playerInfo.placement;
            if (!generalData) {
                const otherCompositions = await Promise.all(participants.map(async (item) => {
                    let eliminated;
                    const summonerResponse = await axios
                        .get(`https://${region}.api.riotgames.com/tft/summoner/v1/summoners/by-puuid/${item.puuid}`)
                        .catch(async (e) => await axios.get(`https://${region}.api.riotgames.com/tft/summoner/v1/summoners/by-puuid/${item.puuid}`));
                    const name = summonerResponse.data.name;
                    const summonerIcon = summonerResponse.data.profileIconId;
                    if (item.last_round <= 3) {
                        eliminated = `1-${item.last_round}`;
                    }
                    else {
                        eliminated = `${1 + Math.ceil((item.last_round - 3) / 7)}-${(item.last_round - 3) % 7 == 0 ? 7 : (item.last_round - 3) % 7}`;
                    }
                    const result = {
                        augments: mapAugments(item.augments, dataDragon),
                        goldLeft: item.gold_left,
                        placement: item.placement,
                        traits: mapTraits(item.traits, dataDragon),
                        units: mapUnits(item.units, dataDragon),
                        eliminated: eliminated,
                        summonerName: name,
                        summonerIcon: summonerIcon
                    };
                    return result;
                }));
                otherCompositions.sort((a, b) => {
                    if (a.placement < b.placement) {
                        return -1;
                    }
                    if (a.placement < b.placement) {
                        return 1;
                    }
                    return 0;
                });
                const match = {
                    players: otherCompositions,
                    matchTime: matchData.info.game_datetime,
                    timeAgo: timeSince(matchData.info.game_datetime),
                    queueType: matchData.info.tft_game_type === 'standard' ? 'Ranked' : 'Normal',
                    placement: placement,
                    trait: mapTraits(playerInfo.traits, dataDragon),
                    units: mapUnits(playerInfo.units, dataDragon),
                    augments: mapAugments(playerInfo.augments, dataDragon)
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
    }
    const winsProcentage = ((wins / countOfGames) * 100).toFixed(2);
    const top4Procentage = ((top4Placements / countOfGames) * 100).toFixed(2);
    const avgPlacement = (sumOfPlacements / countOfGames).toFixed(2);
    if (!generalData) {
        const result = {
            winsProcentage: winsProcentage,
            top4Procentage: top4Procentage,
            avgPlacement: avgPlacement,
            placements: placements,
            wins: wins,
            top4Placements: top4Placements,
            sumOfPlacements: sumOfPlacements
        };
        return [result, allComps];
    }
    else {
        const result = {
            winsProcentage: winsProcentage,
            avgPlacement: avgPlacement,
            wins: wins,
            sumOfPlacements: sumOfPlacements
        };
        return result;
    }
}
export default getPreviousMatchesData;
