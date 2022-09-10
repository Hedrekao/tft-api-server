import getCostOfUnit from './getCostOfUnit.js';
import mapItems from './mapItems.js';

const mapUnits = (rawUnits: Array<Object>) => {
  return rawUnits.map((unit) => {
    const result = {
      id: unit['character_id'],
      level: unit['tier'],
      cost: getCostOfUnit(unit['rarity']),
      items: mapItems(unit['itemNames'], unit['items'])
    };
    return result;
  });
};

export default mapUnits;
