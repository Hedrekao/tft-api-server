import axios from 'axios';
import calculateAndSaveUnitsDataIntoDb from '../helper_functions/tasks/calculateAndSaveUnitsDataIntoDb.js';
import analyzeUnitsPerformance from '../helper_functions/tasks/analyzeUnitsPerformance.js';
import calculateAndSaveAugmentsDataIntoDb from '../helper_functions/tasks/calculateAndSaveAugmentsIntoDb.js';
import calculateAndSaveItemsDataIntoDb from '../helper_functions/tasks/calculateAndSaveItemsDataIntoDb.js';
import analyzeAugmentsPerformance from '../helper_functions/tasks/analyzeAugmentsPerformance.js';
import analyzeItemsPerformance from '../helper_functions/tasks/analyzeItemsPerformance.js';
const collectDataAboutRankings = async (limitOfMatches) => {
    try {
        const challengerDataResponse = await axios.get(`https://euw1.api.riotgames.com/tft/league/v1/challenger?api_key=${process.env.API_KEY}`);
        let totalNumberOfMatches = 0;
        let numberOfComps = 0;
        const unitsObject = {};
        const itemsObject = {};
        const augmentsObject = {};
        const challengersData = challengerDataResponse.data['entries'];
        for (const challengerData of challengersData) {
            const summonerPuuidResponse = await axios.get(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/${challengerData['summonerId']}?api_key=${process.env.API_KEY}`);
            const summonerPuuid = summonerPuuidResponse.data['puuid'];
            const matchesIdResponse = await axios.get(`https://europe.api.riotgames.com/tft/match/v1/matches/by-puuid/${summonerPuuid}/ids?start=0&count=30&api_key=${process.env.API_KEY}
`);
            const matchesId = matchesIdResponse.data;
            for (const matchId of matchesId) {
                const matchDataResponse = await axios.get(`https://europe.api.riotgames.com/tft/match/v1/matches/${matchId}?api_key=${process.env.API_KEY}`);
                const matchData = matchDataResponse.data;
                const participants = matchData['info']['participants'];
                for (const composition of participants) {
                    numberOfComps++;
                    analyzeUnitsPerformance(unitsObject, composition);
                    analyzeItemsPerformance(itemsObject, composition);
                    analyzeAugmentsPerformance(augmentsObject, composition);
                }
                totalNumberOfMatches++;
                if (totalNumberOfMatches == limitOfMatches) {
                    calculateAndSaveUnitsDataIntoDb(unitsObject, numberOfComps);
                    calculateAndSaveItemsDataIntoDb(itemsObject, numberOfComps);
                    calculateAndSaveAugmentsDataIntoDb(augmentsObject, numberOfComps);
                }
            }
        }
    }
    catch (e) {
        console.log(e.message);
    }
};
export default collectDataAboutRankings;
