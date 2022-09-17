const analyzeItems = (
  inputData: Array<Object>,
  itemsData: Object,
  totalNumberOfMatches: number
) => {
  for (const unit of inputData) {
    const items: Array<Object> = unit['item'];
    for (const item of items) {
      item['playRate'] = (
        (itemsData[unit['name']][item['number']]['numberOfComps'] /
          totalNumberOfMatches) *
        100
      ).toFixed(2);

      item['avgPlace'] = (
        itemsData[unit['name']][item['number']]['sumOfPlacements'] /
        totalNumberOfMatches
      ).toFixed(2);
    }

    items.sort((a, b) => {
      if (a['playRate'] > b['playRate']) {
        return -1;
      } else if (a['playRate'] < b['playRate']) {
        return 1;
      } else {
        if (a['avgPlace'] > b['avgPlace']) {
          return -1;
        } else if (a['avgPlace'] < b['avgPlace']) {
          return 1;
        }
      }
      return 0;
    });
  }
};

export default analyzeItems;
