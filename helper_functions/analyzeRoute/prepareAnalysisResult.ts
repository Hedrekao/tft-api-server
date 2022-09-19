import analyzeItems from './analyzeItems.js';
import analyzeAugments from './analyzeAugments.js';

const prepareAnalysisResult = (
  top4Count: number,
  winCount: number,
  placementOverall: number,
  numberOfMatchingComps: number,
  totalNumberOfMatches: number,
  inputData: Array<Object>,
  itemsData: Object,
  augmentsData: Object
) => {
  if (numberOfMatchingComps == 0) {
    return { info: 'no matches with this composition were found' };
  }
  const result = {};
  const top4Procentage = ((top4Count / totalNumberOfMatches) * 100).toFixed(2);

  const winsProcentage = ((winCount / totalNumberOfMatches) * 100).toFixed(2);

  const avgPlacement = (placementOverall / totalNumberOfMatches).toFixed(2);

  const playRate = (numberOfMatchingComps / totalNumberOfMatches).toFixed(2);

  result['top4Ratio'] = parseFloat(top4Procentage);
  result['winRate'] = parseFloat(winsProcentage);
  result['avgPlace'] = parseFloat(avgPlacement);
  result['playRate'] = parseFloat(playRate); // this should include matches that were also without this comp? also how tf u actually calculate this

  analyzeItems(inputData, itemsData, numberOfMatchingComps);

  result['units'] = inputData;
  result['augments'] = analyzeAugments(augmentsData, numberOfMatchingComps);

  return result;
};

export default prepareAnalysisResult;
