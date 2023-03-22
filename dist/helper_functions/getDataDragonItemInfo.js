export function getDataDragonItemInfo(itemData, itemId) {
    const dataDragonItem = itemData[itemId];
    if (dataDragonItem == undefined)
        return { name: '', src: '', type: '' };
    const iconWithWrongExt = dataDragonItem.icon.toLowerCase();
    const type = iconWithWrongExt?.split('/')[5];
    let src = iconWithWrongExt
        .substring(0, iconWithWrongExt.length - 3)
        .concat('png');
    const name = dataDragonItem?.name;
    return {
        name: name,
        src: `https://raw.communitydragon.org/latest/game/${src}`,
        type: type
    };
}
