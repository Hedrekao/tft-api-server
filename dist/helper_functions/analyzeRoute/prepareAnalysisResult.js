import analyzeItems from './analyzeItems.js';
import analyzeAugments from './analyzeAugments.js';
const prepareAnalysisResult = (top4Count, winCount, placementOverall, numberOfMatchingComps, totalNumberOfMatches, totalNumberOfMatchesOverall, inputData, augmentsData, itemsData) => {
    if (numberOfMatchingComps == 0) {
        return { info: 'No matches' };
    }
    const result = {};
    const top4Procentage = ((top4Count / numberOfMatchingComps) * 100).toFixed(2);
    const winsProcentage = ((winCount / numberOfMatchingComps) * 100).toFixed(2);
    const avgPlacement = (placementOverall / numberOfMatchingComps).toFixed(2);
    const playRate = (numberOfMatchingComps / totalNumberOfMatchesOverall).toFixed(2);
    result['top4Ratio'] = parseFloat(top4Procentage);
    result['winRate'] = parseFloat(winsProcentage);
    result['avgPlace'] = parseFloat(avgPlacement);
    result['playRate'] = parseFloat(playRate); // this should include matches that were also without this comp? also how tf u actually calculate this
    if (itemsData != undefined) {
        analyzeItems(inputData, itemsData, numberOfMatchingComps);
        result['units'] = inputData;
    }
    if (augmentsData != undefined) {
        result['augments'] = analyzeAugments(augmentsData, numberOfMatchingComps);
    }
    return result;
};
export default prepareAnalysisResult;
