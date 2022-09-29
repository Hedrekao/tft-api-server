const collectDataAboutItemsCMS = (composition, itemsData, compositionUnits, compositionInput) => {
    for (const unit of compositionInput.units) {
        if (!itemsData.hasOwnProperty(unit.name)) {
            itemsData[unit.name] = {};
        }
        for (const item of compositionUnits[unit['name']]['items']) {
            const unitItems = itemsData[unit['name']];
            if (unitItems.hasOwnProperty(item)) {
                unitItems[item]['numberOfComps'] += 1;
            }
            else {
                unitItems[item] = {};
                unitItems[item]['numberOfComps'] = 1;
            }
        }
    }
};
export default collectDataAboutItemsCMS;
