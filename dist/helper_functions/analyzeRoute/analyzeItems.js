const analyzeItems = (inputData, itemsData, totalNumberOfMatches) => {
    for (const unit of inputData) {
        const items = itemsData[unit['name']];
        const analyzedItems = [];
        for (const item in items) {
            const analyzedItem = {
                id: item,
                name: items[item]['name'],
                playRate: ((items[item]['numberOfComps'] / totalNumberOfMatches) *
                    100).toFixed(2),
                avgPlace: (items[item]['sumOfPlacements'] / totalNumberOfMatches).toFixed(2)
            };
            // item['playRate'] = (
            //   (itemsData[unit['name']][item['id']]['numberOfComps'] /
            //     totalNumberOfMatches) *
            //   100
            // ).toFixed(2);
            // item['avgPlace'] = (
            //   itemsData[unit['name']][item['id']]['sumOfPlacements'] /
            //   totalNumberOfMatches
            // ).toFixed(2);
            analyzedItems.push(analyzedItem);
        }
        analyzedItems.sort((a, b) => {
            if (a['playRate'] > b['playRate']) {
                return -1;
            }
            else if (a['playRate'] < b['playRate']) {
                return 1;
            }
            else {
                if (a['avgPlace'] > b['avgPlace']) {
                    return -1;
                }
                else if (a['avgPlace'] < b['avgPlace']) {
                    return 1;
                }
            }
            return 0;
        });
        unit['items'] = analyzedItems;
    }
};
export default analyzeItems;
