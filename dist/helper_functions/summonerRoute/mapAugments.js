import { cache } from '../singletonCache.js';
const mapAugments = (augments) => {
    const dataDragon = cache.get('dataDragon');
    const set8Data = dataDragon?.items;
    const result = [];
    for (let i = 0; i < augments.length; i++) {
        const dataDragonItem = set8Data[augments[i]];
        const iconWithWrongExt = dataDragonItem?.icon.toLowerCase();
        const icon = iconWithWrongExt
            ?.substring(0, iconWithWrongExt.length - 3)
            .concat('png');
        result.push({
            apiName: augments[i],
            name: dataDragonItem?.name,
            icon: `https://raw.communitydragon.org/latest/game/${icon}`
        });
    }
    return result;
};
export default mapAugments;
