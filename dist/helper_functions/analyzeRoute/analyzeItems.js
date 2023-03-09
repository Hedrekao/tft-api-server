const analyzeItems = (inputData, itemsData, numberOfMatchingComps, dataDragon) => {
    const set8DataItems = dataDragon?.items;
    const set8DataChampions = dataDragon?.sets[8].champions;
    for (const unit of inputData) {
        const dataDragonUnit = set8DataChampions[unit.name];
        const iconWithWrongExt = dataDragonUnit?.icon.toLowerCase();
        const urlArr = iconWithWrongExt.split('/');
        const elementUrl = urlArr[4];
        const url = `https://raw.communitydragon.org/latest/game/assets/characters/${unit.name.toLowerCase()}/hud/${elementUrl
            .replace('.dds', '')
            .toLowerCase()}.png`;
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
