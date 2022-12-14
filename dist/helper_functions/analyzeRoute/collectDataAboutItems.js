const collectDataAboutItems = (composition, inputData, itemsData, compositionUnits) => {
    for (const unit of inputData) {
        if (!itemsData.hasOwnProperty(unit['name'])) {
            itemsData[unit['name']] = {};
        }
        for (const item of compositionUnits[unit['name']]['items']) {
            const unitItems = itemsData[unit['name']];
            if (item > 9) {
                if (unitItems.hasOwnProperty(item)) {
                    unitItems[item]['sumOfPlacements'] += composition['placement'];
                    unitItems[item]['numberOfComps'] += 1;
                }
                else {
                    unitItems[item] = {
                        name: compositionUnits[unit['name']]['itemsNames'][compositionUnits[unit['name']]['items'].indexOf(item)]
                    };
                    unitItems[item]['sumOfPlacements'] = composition['placement'];
                    unitItems[item]['numberOfComps'] = 1;
                }
            }
        }
    }
};
export default collectDataAboutItems;
