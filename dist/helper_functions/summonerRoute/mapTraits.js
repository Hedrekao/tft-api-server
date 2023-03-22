import { getDataDragonTraitInfo } from '../getDataDragonTraitInfo.js';
const mapTraits = (rawTraits, dataDragon) => {
    const set8Data = dataDragon?.sets[8].traits;
    if (set8Data == undefined)
        return [];
    rawTraits = rawTraits.filter((trait) => {
        return trait.style != 0;
    });
    const traits = rawTraits.map((trait) => {
        const { name, src } = getDataDragonTraitInfo(set8Data, trait.name);
        const result = {
            apiName: trait.name,
            name: name,
            icon: src,
            currentTrait: trait.num_units,
            style: trait.style
        };
        return result;
    });
    traits.sort((a, b) => {
        if (a.style > b.style) {
            return -1;
        }
        if (a.style < b.style) {
            return 1;
        }
        return 0;
    });
    return traits;
};
export default mapTraits;
