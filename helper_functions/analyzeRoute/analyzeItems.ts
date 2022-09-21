const analyzeItems = (
  inputData: Array<Object>,
  itemsData: Object,
  numberOfMatchingComps: number
) => {
  for (const unit of inputData) {
    const items: Object = itemsData[unit['name']];
    let analyzedItems: Array<Object> = [];
    for (const item in items) {
      const analyzedItem: Object = {
        id: item,
        name: items[item]['name'],
        playRate: (
          (items[item]['numberOfComps'] / numberOfMatchingComps) *
          100
        ).toFixed(2),
        avgPlace: (
          items[item]['sumOfPlacements'] / items[item]['numberOfComps']
        ).toFixed(2)
      };
      analyzedItems.push(analyzedItem);
    }

    analyzedItems.sort((a, b) => {
      if (parseFloat(a['playRate']) > parseFloat(b['playRate'])) {
        return -1;
      } else if (parseFloat(a['playRate']) < parseFloat(b['playRate'])) {
        return 1;
      } else {
        if (parseFloat(a['avgPlace']) < parseFloat(b['avgPlace'])) {
          return -1;
        } else if (parseFloat(a['avgPlace']) > parseFloat(b['avgPlace'])) {
          return 1;
        }
      }
      return 0;
    });

    unit['items'] = analyzedItems;
  }
};

export default analyzeItems;
