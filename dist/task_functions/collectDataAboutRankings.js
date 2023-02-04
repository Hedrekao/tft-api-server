import axios from 'axios';
import calculateAndSaveUnitsDataIntoDb from '../helper_functions/tasks/calculateAndSaveUnitsDataIntoDb.js';
import analyzeUnitsPerformance from '../helper_functions/tasks/analyzeUnitsPerformance.js';
import calculateAndSaveAugmentsDataIntoDb from '../helper_functions/tasks/calculateAndSaveAugmentsIntoDb.js';
import calculateAndSaveItemsDataIntoDb from '../helper_functions/tasks/calculateAndSaveItemsDataIntoDb.js';
import analyzeAugmentsPerformance from '../helper_functions/tasks/analyzeAugmentsPerformance.js';
import analyzeItemsPerformance from '../helper_functions/tasks/analyzeItemsPerformance.js';
import saveTotalNumberOfMatches from '../helper_functions/tasks/saveTotalNumberOfMatches.js';
import { cache } from '../helper_functions/singletonCache.js';
import sleep from '../helper_functions/sleep.js';
import throttledQueue from 'throttled-queue';
const collectDataAboutRankings = async (limitOfMatches) => {
    try {
        const challengerDataResponse = await axios.get(`https://euw1.api.riotgames.com/tft/league/v1/challenger`);
        const throttle = throttledQueue(490, 10000, true);
        const dataDragon = cache.get('dataDragon');
        let totalNumberOfMatches = 0;
        let numberOfComps = 0;
        const unitsObject = {};
        const itemsObject = {};
        const augmentsObject = {};
        const firstChoiceAugmentObject = {};
        const secondChoiceAugmentObject = {};
        const thirdChoiceAugmentObject = {};
        const usedChallengersIdArray = [];
        const visitedMatches = [];
        const challengersData = challengerDataResponse.data.entries;
        while (totalNumberOfMatches < limitOfMatches) {
            let challengerArrayId = Math.floor(Math.random() * challengersData.length);
            let challengerData = challengersData[challengerArrayId];
            while (challengerData == undefined ||
                usedChallengersIdArray.includes(challengerArrayId)) {
                if (usedChallengersIdArray.length - 1 == challengersData.length)
                    break;
                challengerArrayId = Math.floor(Math.random() * challengersData.length);
                challengerData = challengersData[challengerArrayId];
            }
            usedChallengersIdArray.push(challengerArrayId);
            const summonerPuuidResponse = await throttle(() => axios.get(`https://euw1.api.riotgames.com/tft/summoner/v1/summoners/${challengerData.summonerId}`));
            const summonerPuuid = summonerPuuidResponse.data.puuid;
            const matchesIdResponse = await throttle(() => axios.get(`https://europe.api.riotgames.com/tft/match/v1/matches/by-puuid/${summonerPuuid}/ids?start=0&count=15
`));
            const promises = [];
            const matchesId = matchesIdResponse.data;
            for (const matchId of matchesId) {
                if (visitedMatches.includes(matchId)) {
                    continue;
                }
                visitedMatches.push(matchId);
                const matchDataResponse = throttle(() => axios
                    .get(`https://europe.api.riotgames.com/tft/match/v1/matches/${matchId}`)
                    .catch((e) => axios.get(`https://europe.api.riotgames.com/tft/match/v1/matches/${matchId}`)));
                promises.push(matchDataResponse);
            }
            const resolvedPromises = await Promise.allSettled(promises);
            const resolvedPromisesData = [];
            resolvedPromises.forEach(async (promise) => {
                if (promise.status == 'fulfilled') {
                    if (parseInt(promise.value.headers['x-method-rate-limit-count'].split(':')[0]) >= 155) {
                        await sleep(5000);
                    }
                    resolvedPromisesData.push(promise.value.data);
                }
            });
            for (const matchData of resolvedPromisesData) {
                const participants = matchData.info.participants;
                for (const composition of participants) {
                    numberOfComps++;
                    analyzeUnitsPerformance(unitsObject, composition);
                    analyzeItemsPerformance(itemsObject, composition);
                    analyzeAugmentsPerformance(augmentsObject, firstChoiceAugmentObject, secondChoiceAugmentObject, thirdChoiceAugmentObject, composition);
                }
                totalNumberOfMatches++;
                if (totalNumberOfMatches == limitOfMatches) {
                    saveTotalNumberOfMatches(totalNumberOfMatches, numberOfComps);
                    calculateAndSaveUnitsDataIntoDb(unitsObject, dataDragon);
                    calculateAndSaveItemsDataIntoDb(itemsObject, dataDragon);
                    calculateAndSaveAugmentsDataIntoDb(augmentsObject, firstChoiceAugmentObject, secondChoiceAugmentObject, thirdChoiceAugmentObject, dataDragon);
                    return;
                }
            }
        }
        saveTotalNumberOfMatches(totalNumberOfMatches, numberOfComps);
        calculateAndSaveUnitsDataIntoDb(unitsObject, dataDragon);
        calculateAndSaveItemsDataIntoDb(itemsObject, dataDragon);
        calculateAndSaveAugmentsDataIntoDb(augmentsObject, firstChoiceAugmentObject, secondChoiceAugmentObject, thirdChoiceAugmentObject, dataDragon);
        return;
    }
    catch (e) {
        console.log(e.message);
    }
};
export default collectDataAboutRankings;
