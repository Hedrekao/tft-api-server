import getCostOfUnit from './getCostOfUnit.js';
import mapItems from './mapItems.js';

const mapUnits = (rawUnits: Array<Object>) => {
  const units = rawUnits.map((unit) => {
    const result = {
      id: unit['character_id'],
      level: unit['tier'],
      cost: getCostOfUnit(unit['rarity']),
      items: mapItems(unit['itemNames'], unit['items'])
    };
    return result;
  });

  units.sort((a, b) => {
    if (a['level'] > b['level']) {
      return -1;
    } else if (a['level'] < b['level']) {
      return 1;
    } else {
      if (a['items'].length > b['items'].length) {
        return -1;
      } else if (a['items'].length < b['items'].length) {
        return 1;
      }
    }

    return 0;
  });

  return units;
};

export default mapUnits;
