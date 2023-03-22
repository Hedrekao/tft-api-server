import { getDataDragonUnitInfo } from '../getDataDragonUnitInfo.js';
const analyzeItems = (inputData, itemsData, numberOfMatchingComps, dataDragon) => {
    const set8DataItems = dataDragon?.items;
    const set8DataChampions = dataDragon?.sets[8].champions;
    if (set8DataItems == undefined || set8DataChampions == undefined)
        return;
    for (const unit of inputData) {
        const unitInfo = getDataDragonUnitInfo(set8DataChampions, unit.name);
        let url = 'Error';
        if (unitInfo != undefined) {
            url = unitInfo.url;
        }
        unit.icon = url;
        const items = itemsData[unit.name];
        let analyzedItems = new Array();
        for (const item in items) {
            const dataDragonItem = set8DataItems[items[item].name];
            const iconWithWrongExt = dataDragonItem?.icon.toLowerCase();
            const icon = iconWithWrongExt
                ?.substring(0, iconWithWrongExt.length - 3)
                .concat('png');
            const analyzedItem = {
                id: items[item].name,
                name: dataDragonItem.name,
                icon: `https://raw.communitydragon.org/latest/game/${icon}`,
                playRate: ((items[item].numberOfComps / numberOfMatchingComps) *
                    100).toFixed(2),
                avgPlace: (items[item].sumOfPlacements / items[item].numberOfComps).toFixed(2)
            };
            analyzedItems.push(analyzedItem);
        }
        analyzedItems.sort((a, b) => {
            if (parseFloat(a.playRate) > parseFloat(b.playRate)) {
                return -1;
            }
            else if (parseFloat(a.playRate) < parseFloat(b.playRate)) {
                return 1;
            }
            else {
                if (parseFloat(a.avgPlace) < parseFloat(b.avgPlace)) {
                    return -1;
                }
                else if (parseFloat(a.avgPlace) > parseFloat(b.avgPlace)) {
                    return 1;
                }
            }
            return 0;
        });
        unit.items = analyzedItems;
    }
};
export default analyzeItems;
