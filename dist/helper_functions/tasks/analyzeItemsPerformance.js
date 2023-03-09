const analyzeItemsPerformance = (itemsObject, composition) => {
    for (const unit of composition.units) {
        for (const item of unit.itemNames) {
            if (itemsObject.hasOwnProperty(item)) {
                itemsObject[item].sumOfPlacements += composition.placement;
                itemsObject[item].numberOfComps += 1;
                if (composition.placement == 1) {
                    itemsObject[item].numberOfWins += 1;
                }
            }
            else {
                itemsObject[item] = {
                    sumOfPlacements: composition.placement,
                    numberOfComps: 1,
                    numberOfWins: 0
                };
                if (composition.placement == 1) {
                    itemsObject[item].numberOfWins++;
                }
            }
        }
    }
};
export default analyzeItemsPerformance;
