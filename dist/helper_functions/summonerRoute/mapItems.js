import { cache } from '../singletonCache.js';
const mapItems = (names, dataDragon) => {
    const set8Data = dataDragon?.items;
    const result = [];
    for (let i = 0; i < names.length; i++) {
        const cachedItem = cache.get(`item-${names[i]}`);
        if (cachedItem != undefined) {
            result.push(cachedItem);
            continue;
        }
        const dataDragonItem = set8Data[names[i]];
        const iconWithWrongExt = dataDragonItem?.icon.toLowerCase();
        const icon = iconWithWrongExt
            ?.substring(0, iconWithWrongExt.length - 3)
            .concat('png');
        const item = {
            apiName: names[i],
            name: dataDragonItem?.name,
            icon: `https://raw.communitydragon.org/latest/game/${icon}`
        };
        cache.set(`item-${names[i]}`, item);
        result.push(item);
    }
    return result;
};
export default mapItems;
