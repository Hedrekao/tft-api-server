import { getDataDragonAugmentInfo } from '../getDataDragonAugmentInfo.js';
const mapAugments = (augments, dataDragon) => {
    const set8Data = dataDragon?.augments;
    const result = [];
    if (set8Data == undefined)
        return [];
    for (let i = 0; i < augments.length; i++) {
        const { name, src } = getDataDragonAugmentInfo(set8Data, augments[i]);
        const augment = {
            apiName: augments[i],
            name: name,
            icon: src
        };
        result.push(augment);
    }
    return result;
};
export default mapAugments;
