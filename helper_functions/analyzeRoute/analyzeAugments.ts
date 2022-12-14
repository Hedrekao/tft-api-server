import { createRequire } from 'module'; // Bring in the ability to create the 'require' method
const require = createRequire(import.meta.url); // construct the require method
const augmentsJson: Object = require('../../static/Augments.json');
const augmentsDataJson: Array<Object> = augmentsJson['items'];

const analyzeAugments = (
  augmentsData: Object,
  numberOfMatchingComps: number
) => {
  const result = [];

  for (const augmentData in augmentsData) {
    const augment = {};

    const augmentNameObject = augmentsDataJson.find(
      (val) => val['apiName'] == augmentData
    );
    let name;
    if (augmentNameObject != null && augmentNameObject.hasOwnProperty('name')) {
      name = augmentNameObject['name'];
    } else {
      name = augmentData;
    }
    const src = `https://ittledul.sirv.com/Images/augments/${augmentData}.png`;
    augment['name'] = name;
    augment['src'] = src;
    augment['avgPlace'] = (
      augmentsData[augmentData]['sumOfPlacements'] /
      augmentsData[augmentData]['numberOfComps']
    ).toFixed(2);
    augment['winRate'] = (
      (augmentsData[augmentData]['numberOfWins'] /
        augmentsData[augmentData]['numberOfComps']) *
      100
    ).toFixed(2);
    augment['playRate'] = (
      (augmentsData[augmentData]['numberOfComps'] / numberOfMatchingComps) *
      100
    ).toFixed(2);
    result.push(augment);
  }

  result.sort((a, b) => {
    if (parseFloat(a['playRate']) > 1 && parseFloat(b['playRate']) < 1) {
      return -1;
    } else if (parseFloat(a['playRate']) < 1 && parseFloat(b['playRate']) > 1) {
      return 1;
    } else {
      if (parseFloat(a['avgPlace']) < parseFloat(b['avgPlace'])) {
        return -1;
      } else if (parseFloat(a['avgPlace']) > parseFloat(b['avgPlace'])) {
        return 1;
      } else {
        if (parseFloat(a['winRate']) > parseFloat(b['winRate'])) {
          return -1;
        } else if (parseFloat(a['winRate']) < parseFloat(b['winRate'])) {
          return 1;
        }
      }
    }
    return 0;
  });
  return result;
};

export default analyzeAugments;
