import getCostOfUnit from './getCostOfUnit.js';
import mapItems from './mapItems.js';
import { cache } from '../singletonCache.js';
const mapUnits = (rawUnits) => {
    const dataDragon = cache.get('dataDragon');
    const set8Data = dataDragon?.sets[8].champions;
    const units = rawUnits.map((unit) => {
        const dataDragonUnit = set8Data?.find((v) => v.apiName == unit['character_id']);
        const iconWithWrongExt = dataDragonUnit?.icon.toLowerCase();
        let icon = iconWithWrongExt
            ?.substring(0, iconWithWrongExt.length - 3)
            .concat('png');
        const idx = icon?.indexOf('.tft');
        const prefix = icon?.substring(0, idx);
        icon = prefix?.concat('_square').concat(icon?.substring(idx));
        const cost = getCostOfUnit(unit['rarity']);
        const result = {
            id: unit['character_id'],
            name: dataDragonUnit?.name,
            icon: `https://raw.communitydragon.org/latest/game/${icon}`,
            level: unit['tier'],
            cost: cost,
            items: mapItems(unit['itemNames'], unit['items'])
        };
        return result;
    });
    units.sort((a, b) => {
        if (a['level'] > b['level']) {
            return -1;
        }
        else if (a['level'] < b['level']) {
            return 1;
        }
        else {
            if (a['items'].length > b['items'].length) {
                return -1;
            }
            else if (a['items'].length < b['items'].length) {
                return 1;
            }
            else {
                if (a['cost'] > b['cost']) {
                    return -1;
                }
                else if (a['cost'] < b['cost']) {
                    return 1;
                }
            }
        }
        return 0;
    });
    return units;
};
export default mapUnits;
