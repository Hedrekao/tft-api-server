import axios from 'axios';
const findMatchingComposition = async (inputData) => {
    try {
        const result = [];
        const challengerDataResponse = await axios.get(`https://euw1.api.riotgames.com/tft/league/v1/challenger?api_key=${process.env.API_KEY}`);
        const challengersData = challengerDataResponse.data['entries'];
        for (const challengerData of challengersData) {
            const summonerPuuidResponse = await axios.get(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/${challengerData['summonerId']}?api_key=${process.env.API_KEY}`);
            const summonerPuuid = summonerPuuidResponse.data['puuid'];
            const matchesIdResponse = await axios.get(`https://europe.api.riotgames.com/tft/match/v1/matches/by-puuid/${summonerPuuid}/ids?start=0&count=30&api_key=${process.env.API_KEY}
`);
            const matchesId = matchesIdResponse.data;
            let totalNumberOfMatches = 0;
            for (const matchId of matchesId) {
                const matchDataResponse = await axios.get(`https://europe.api.riotgames.com/tft/match/v1/matches/${matchId}?api_key=${process.env.API_KEY}`);
                const matchData = matchDataResponse.data;
                const participants = matchData['participants'];
                for (const composition of participants) {
                    let isCompositionMatchingInput = true;
                    const compositionUnits = composition['units'].reduce((object, item) => {
                        const name = item['character_id'];
                        object[name] = {
                            name: {
                                level: item['tier'],
                                items: item['items']
                            }
                        };
                        return object;
                    }, {});
                    for (const unit of inputData) {
                        const unitIndex = Object.keys(compositionUnits).indexOf(unit['character_id']);
                        if (unitIndex == -1) {
                            isCompositionMatchingInput = false;
                            break;
                        }
                        else {
                            if (compositionUnits[unit['character_id']]['level'] !=
                                unit['isLevel3']) {
                                isCompositionMatchingInput = false;
                                break;
                            }
                            const items = unit['items'];
                            if (!items.every((item) => {
                                return compositionUnits[unit['character_id']]['items'].indexOf(item);
                            })) {
                                isCompositionMatchingInput = false;
                                break;
                            }
                        }
                    }
                    if (isCompositionMatchingInput) {
                        totalNumberOfMatches++;
                        // analyzeComposition(composition) // TO DO!!
                    }
                }
                result.push(matchData);
            }
            return result;
        }
    }
    catch (error) {
        console.log(error.message);
    }
};
