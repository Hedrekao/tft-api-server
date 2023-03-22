export function getDataDragonTraitInfo(traitData, traitId) {
    const dataDragonTrait = traitData.find((trait) => trait.apiName == traitId);
    if (dataDragonTrait == undefined)
        return { name: '', src: '' };
    const iconWithWrongExt = dataDragonTrait?.icon.toLowerCase();
    const icon = iconWithWrongExt
        ?.substring(0, iconWithWrongExt.length - 3)
        .concat('png');
    const name = dataDragonTrait.name;
    return {
        name: name,
        src: `https://raw.communitydragon.org/latest/game/${icon}`
    };
}
