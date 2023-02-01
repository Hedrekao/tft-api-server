import analyzeItems from './analyzeItems.js';
import analyzeAugments from './analyzeAugments.js';
import { cache } from '../singletonCache.js';
const prepareAnalysisResult = (top4Count, winCount, placementOverall, numberOfMatchingComps, totalNumberOfMatches, totalNumberOfMatchesOverall, inputData, augmentsData, itemsData) => {
    if (numberOfMatchingComps == 0) {
        return { info: 'No matches' };
    }
    const dataDragon = cache.get('dataDragon');
    const top4Procentage = ((top4Count / numberOfMatchingComps) * 100).toFixed(2);
    const winsProcentage = ((winCount / numberOfMatchingComps) * 100).toFixed(2);
    const avgPlacement = (placementOverall / numberOfMatchingComps).toFixed(2);
    const playRate = (numberOfMatchingComps / totalNumberOfMatchesOverall).toFixed(2);
    if (itemsData != undefined) {
        analyzeItems(inputData, itemsData, numberOfMatchingComps, dataDragon);
    }
    const result = {
        top4Ratio: parseFloat(top4Procentage),
        winRate: parseFloat(winsProcentage),
        avgPlace: parseFloat(avgPlacement),
        playRate: parseFloat(playRate),
        augments: augmentsData != undefined
            ? analyzeAugments(augmentsData, numberOfMatchingComps, dataDragon)
            : null,
        units: inputData
    };
    return result;
};
export default prepareAnalysisResult;
