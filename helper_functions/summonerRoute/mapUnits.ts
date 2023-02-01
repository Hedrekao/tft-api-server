import getCostOfUnit from './getCostOfUnit.js';
import mapItems from './mapItems.js';

const mapUnits = (
  rawUnits: RiotAPIUnitDto[],
  dataDragon: DataDragon | undefined
) => {
  const set8Data = dataDragon?.sets[8].champions;
  const units = rawUnits.map((unit) => {
    const dataDragonUnit = set8Data![unit.character_id];
    const iconWithWrongExt = dataDragonUnit?.icon.toLowerCase();
    const urlArr: string[] = iconWithWrongExt.split('/');
    const elementUrl = urlArr[4];
    const url = `https://raw.communitydragon.org/latest/game/assets/characters/${unit.character_id.toLowerCase()}/hud/${elementUrl
      .replace('.dds', '')
      .toLowerCase()}.png`;

    const cost: number = getCostOfUnit(unit.rarity);

    const items = mapItems(unit.itemNames, unit.items, dataDragon!);

    const result = {
      id: unit.character_id,
      name: dataDragonUnit?.name,
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
