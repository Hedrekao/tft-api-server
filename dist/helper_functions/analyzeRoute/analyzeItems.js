const analyzeItems = (inputData, itemsData, numberOfMatchingComps) => {
    for (const unit of inputData) {
        const items = itemsData[unit.name];
        let analyzedItems = new Array();
        for (const item in items) {
            const analyzedItem = {
                id: parseInt(item),
                name: items[item].name,
                playRate: ((items[item].numberOfComps / numberOfMatchingComps) *
                    100).toFixed(2),
                avgPlace: (items[item].sumOfPlacements / items[item].numberOfComps).toFixed(2)
            };
            analyzedItems.push(analyzedItem);
        }
        analyzedItems.sort((a, b) => {
            if (parseFloat(a.playRate) > parseFloat(b.playRate)) {
                return -1;
            }
            else if (parseFloat(a.playRate) < parseFloat(b.playRate)) {
                return 1;
            }
            else {
                if (parseFloat(a.avgPlace) < parseFloat(b.avgPlace)) {
                    return -1;
                }
                else if (parseFloat(a.avgPlace) > parseFloat(b.avgPlace)) {
                    return 1;
                }
            }
            return 0;
        });
        unit.items = analyzedItems;
    }
};
export default analyzeItems;
