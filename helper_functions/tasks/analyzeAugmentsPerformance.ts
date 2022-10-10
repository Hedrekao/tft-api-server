const analyzeAugmentsPerformance = (
  augmentsObject: Object,
  firstChoiceAugmentObject: Object,
  secondChoiceAugmentObject: Object,
  thirdChoiceAugmentObject: Object,
  composition: Array<Object>
) => {
  for (let i = 0; i < composition['augments'].length; i++) {
    let augment: string = composition['augments'][i];
    augment = augment.replace('HR', '');
    switch (i) {
      case 0:
        if (firstChoiceAugmentObject.hasOwnProperty(augment)) {
          firstChoiceAugmentObject[augment]['sumOfPlacement'] +=
            composition['placement'];
          firstChoiceAugmentObject[augment]['frequency'] += 1;
          if (composition['placement'] == 1) {
            firstChoiceAugmentObject[augment]['winrate'] += 1;
          }
        } else {
          firstChoiceAugmentObject[augment] = {};
          firstChoiceAugmentObject[augment]['sumOfPlacement'] =
            composition['placement'];
          firstChoiceAugmentObject[augment]['frequency'] = 1;
          if (composition['placement'] == 1) {
            firstChoiceAugmentObject[augment]['winrate'] = 1;
          } else {
            firstChoiceAugmentObject[augment]['winrate'] = 0;
          }
        }
        break;
      case 1:
        if (secondChoiceAugmentObject.hasOwnProperty(augment)) {
          secondChoiceAugmentObject[augment]['sumOfPlacement'] +=
            composition['placement'];
          secondChoiceAugmentObject[augment]['frequency'] += 1;
          if (composition['placement'] == 1) {
            secondChoiceAugmentObject[augment]['winrate'] += 1;
          }
        } else {
          secondChoiceAugmentObject[augment] = {};
          secondChoiceAugmentObject[augment]['sumOfPlacement'] =
            composition['placement'];
          secondChoiceAugmentObject[augment]['frequency'] = 1;
          if (composition['placement'] == 1) {
            secondChoiceAugmentObject[augment]['winrate'] = 1;
          } else {
            secondChoiceAugmentObject[augment]['winrate'] = 0;
          }
        }
        break;
      case 2:
        if (thirdChoiceAugmentObject.hasOwnProperty(augment)) {
          thirdChoiceAugmentObject[augment]['sumOfPlacement'] +=
            composition['placement'];
          thirdChoiceAugmentObject[augment]['frequency'] += 1;
          if (composition['placement'] == 1) {
            thirdChoiceAugmentObject[augment]['winrate'] += 1;
          }
        } else {
          thirdChoiceAugmentObject[augment] = {};
          thirdChoiceAugmentObject[augment]['sumOfPlacement'] =
            composition['placement'];
          thirdChoiceAugmentObject[augment]['frequency'] = 1;
          if (composition['placement'] == 1) {
            thirdChoiceAugmentObject[augment]['winrate'] = 1;
          } else {
            thirdChoiceAugmentObject[augment]['winrate'] = 0;
          }
        }
        break;
    }
    if (augmentsObject.hasOwnProperty(augment)) {
      augmentsObject[augment]['sumOfPlacement'] += composition['placement'];
      augmentsObject[augment]['frequency'] += 1;
      if (composition['placement'] == 1) {
        augmentsObject[augment]['winrate'] += 1;
      }
    } else {
      augmentsObject[augment] = {};
      augmentsObject[augment]['sumOfPlacement'] = composition['placement'];
      augmentsObject[augment]['frequency'] = 1;
      if (composition['placement'] == 1) {
        augmentsObject[augment]['winrate'] = 1;
      } else {
        augmentsObject[augment]['winrate'] = 0;
      }
    }
  }
};

export default analyzeAugmentsPerformance;
