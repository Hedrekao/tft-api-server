const collectDataAboutAugments = (
  composition: Array<Object>,
  augmentsData: Object
) => {
  for (const augment of composition['augments']) {
    if (augmentsData.hasOwnProperty(augment)) {
      augmentsData[augment]['sumOfPlacements'] += composition['placement'];
      augmentsData[augment]['numberOfComps'] += 1;
      if (composition['placement'] == 1) {
        augmentsData[augment]['numberOfWins'] += 1;
      }
    } else {
      augmentsData[augment] = {};
      augmentsData[augment]['sumOfPlacements'] = composition['placement'];
      augmentsData[augment]['numberOfComps'] = 1;

      if (composition['placement'] == 1) {
        augmentsData[augment]['numberOfWins'] = 1;
      } else {
        augmentsData[augment]['numberOfWins'] = 0;
      }
    }
  }
};

export default collectDataAboutAugments;
