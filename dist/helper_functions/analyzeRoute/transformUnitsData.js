const transformUnitsData = (units) => {
    return units.reduce((object, item) => {
        const name = item['character_id'];
        object[name] = {
            level: item['tier'],
            items: item['items'],
            itemsNames: item['itemNames']
        };
        return object;
    }, {});
};
export default transformUnitsData;
