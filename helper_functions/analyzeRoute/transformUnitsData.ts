const transformUnitsData = (units: Array<Object>) => {
  return units.reduce((object: Object, item: Object) => {
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
