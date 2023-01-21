const transformUnitsData = (units: RiotAPIUnitDto[]) => {
  return units.reduce((object, unit) => {
    const name = unit.character_id;
    object[name] = {
      level: unit.tier,
      items: unit.items,
      itemsNames: unit.itemNames
    };

    return object;
  }, {} as TransformedUnits);
};
export default transformUnitsData;
