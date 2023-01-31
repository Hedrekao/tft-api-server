const analyzeItemsPerformance = (itemsObject, composition) => {
    for (const unit of composition.units) {
        for (const item of unit.items) {
            if (itemsObject.hasOwnProperty(item)) {
                itemsObject[item]['sumOfPlacement'] += composition.placement;
                itemsObject[item]['frequency'] += 1;
                if (composition.placement == 1) {
                    itemsObject[item]['winrate'] += 1;
                }
            }
            else {
                itemsObject[item] = {};
                itemsObject[item]['sumOfPlacement'] = composition.placement;
                itemsObject[item]['frequency'] = 1;
                if (composition.placement == 1) {
                    itemsObject[item]['winrate'] = 1;
                }
                else {
                    itemsObject[item]['winrate'] = 0;
                }
            }
        }
    }
};
export default analyzeItemsPerformance;
