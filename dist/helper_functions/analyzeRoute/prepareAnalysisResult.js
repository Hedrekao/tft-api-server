import analyzeItems from './analyzeItems.js';
import analyzeAugments from './analyzeAugments.js';
const prepareAnalysisResult = (top4Count, winCount, placementOverall, numberOfMatchingComps, totalNumberOfMatches, inputData, itemsData, augmentsData) => {
    const result = {};
    const top4Procentage = ((top4Count / totalNumberOfMatches) * 100).toFixed(2);
    const winsProcentage = ((winCount / totalNumberOfMatches) * 100).toFixed(2);
    const avgPlacement = (placementOverall / totalNumberOfMatches).toFixed(2);
    const playRate = (numberOfMatchingComps / totalNumberOfMatches).toFixed(2);
    result['top4Ratio'] = parseFloat(top4Procentage);
    result['winRate'] = parseFloat(winsProcentage);
    result['avgPlace'] = parseFloat(avgPlacement);
    result['playRate'] = parseFloat(playRate);
    analyzeItems(inputData, itemsData, totalNumberOfMatches);
    result['units'] = inputData;
    result['augments'] = analyzeAugments(augmentsData, totalNumberOfMatches);
    return result;
};
export default prepareAnalysisResult;
