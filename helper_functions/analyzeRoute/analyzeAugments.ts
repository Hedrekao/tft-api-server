import { getDataDragonAugmentInfo } from '../getDataDragonAugmentInfo.js';

const analyzeAugments = (
  augmentsData: AugmentsData,
  numberOfMatchingComps: number,
  dataDragon: DataDragon | undefined
) => {
  const result = [];
  const set8Data = dataDragon?.augments;
  for (const augmentData in augmentsData) {
    if (set8Data == undefined) {
      break;
    }
    const { name, src } = getDataDragonAugmentInfo(set8Data, augmentData);

    const augment = {
      apiName: augmentData,
      name: name,
      src: src,
      avgPlace: (
        augmentsData[augmentData].sumOfPlacements /
        augmentsData[augmentData].numberOfComps
      ).toFixed(2),
      winRate: (
        (augmentsData[augmentData].numberOfWins /
          augmentsData[augmentData].numberOfComps) *
        100
      ).toFixed(2),
      playRate: (
        (augmentsData[augmentData].numberOfComps / numberOfMatchingComps) *
        100
      ).toFixed(2)
    };
    result.push(augment);
  }

  result.sort((a, b) => {
    if (parseFloat(a.playRate) > 1 && parseFloat(b.playRate) < 1) {
      return -1;
    } else if (parseFloat(a.playRate) < 1 && parseFloat(b.playRate) > 1) {
      return 1;
    } else {
      if (parseFloat(a.avgPlace) < parseFloat(b.avgPlace)) {
        return -1;
      } else if (parseFloat(a.avgPlace) > parseFloat(b.avgPlace)) {
        return 1;
      } else {
        if (parseFloat(a.winRate) > parseFloat(b.winRate)) {
          return -1;
        } else if (parseFloat(a.winRate) < parseFloat(b.winRate)) {
          return 1;
        }
      }
    }
    return 0;
  });
  return result;
};

export default analyzeAugments;
