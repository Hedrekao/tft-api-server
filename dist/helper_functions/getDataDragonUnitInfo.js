export function getDataDragonUnitInfo(units, unitId) {
    const dataDragonUnit = units[unitId];
    if (dataDragonUnit == undefined)
        return undefined;
    const iconWithWrongExt = dataDragonUnit.icon.toLowerCase();
    const urlArr = iconWithWrongExt.split('/');
    let elementUrl = urlArr[4];
    if (iconWithWrongExt.includes('stage2')) {
        elementUrl = elementUrl.replace('.tft', '_square.tft');
    }
    const url = `https://raw.communitydragon.org/latest/game/assets/characters/${unitId.toLowerCase()}/hud/${elementUrl
        ?.replace('.dds', '')
        .toLowerCase()}.png`;
    const name = dataDragonUnit.name;
    return { url, name };
}
