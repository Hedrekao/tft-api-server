const collectDataAboutItems = (
  composition: Array<Object>,
  inputData: Array<Object>,
  itemsData: Object
) => {
  for (const unit of inputData) {
    for (const item of unit['item']) {
      const unitItems = itemsData[unit['name']];
      if (unitItems.hasOwnProperty(item['number'])) {
        unitItems[item['number']]['sumOfPlacements'] +=
          composition['placement'];
        unitItems[item['number']]['numberOfComps'] += 1;
      } else {
        unitItems[item['number']]['sumOfPlacements'] = composition['placement'];
        unitItems[item['number']]['numberOfComps'] = 1;
      }
    }
  }
};

export default collectDataAboutItems;
