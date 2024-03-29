const transformUnitsData = (units) => {
    return units.reduce((object, unit) => {
        const name = unit.character_id;
        object[name] = {
            level: unit.tier,
            itemsNames: unit.itemNames
        };
        return object;
    }, {});
};
export default transformUnitsData;
