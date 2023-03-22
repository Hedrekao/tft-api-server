import { getDataDragonUnitInfo } from '../getDataDragonUnitInfo.js';
import getCostOfUnit from './getCostOfUnit.js';
import mapItems from './mapItems.js';

const mapUnits = (
  rawUnits: RiotAPIUnitDto[],
  dataDragon: DataDragon | undefined
) => {
  const set8Data = dataDragon?.sets[8].champions;
  if (set8Data == undefined) return;
  const units = rawUnits.map((unit) => {
    const unitInfo = getDataDragonUnitInfo(set8Data, unit.character_id);

    let url = 'Error';
    let name = 'Error';
    if (unitInfo != undefined) {
      url = unitInfo.url;
      name = unitInfo.name;
    }

    const cost: number = getCostOfUnit(unit.rarity);

    const items = mapItems(unit.itemNames, dataDragon!);

    const result = {
      id: unit.character_id,
      name: name,
      icon: url,
      level: unit.tier,
      cost: cost,
      items: items
    };

    return result;
  });

  units.sort((a, b) => {
    if (a.level > b.level) {
      return -1;
    } else if (a.level < b.level) {
      return 1;
    } else {
      if (a.items.length > b.items.length) {
        return -1;
      } else if (a.items.length < b.items.length) {
        return 1;
      } else {
        if (a.cost > b.cost) {
          return -1;
        } else if (a.cost < b.cost) {
          return 1;
        }
      }
    }

    return 0;
  });

  return units;
};

export default mapUnits;
