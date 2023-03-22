export function getDataDragonAugmentInfo(
  augmentData: DataDragon['augments'],
  augmentId: string
) {
  const dataDragonItem = augmentData[augmentId];
  const iconWithWrongExt = dataDragonItem.icon.toLowerCase();
  let src = iconWithWrongExt
    .substring(0, iconWithWrongExt.length - 3)
    .concat('png');
  src = src.replace('hexcore', 'choiceui');

  const name = dataDragonItem?.name;

  return {
    name: name,
    src: `https://raw.communitydragon.org/latest/game/${src}`
  };
}
