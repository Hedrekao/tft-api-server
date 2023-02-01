const mapAugments = (
  augments: Array<string>,
  dataDragon: DataDragon | undefined
) => {
  const set8Data = dataDragon?.augments;
  const result = [];

  for (let i = 0; i < augments.length; i++) {
    const dataDragonItem = set8Data![augments[i]];
    const iconWithWrongExt = dataDragonItem?.icon.toLowerCase();
    const icon = iconWithWrongExt
      ?.substring(0, iconWithWrongExt.length - 3)
      .concat('png');
    const augment = {
      apiName: augments[i],
      name: dataDragonItem?.name,
      icon: `https://raw.communitydragon.org/latest/game/${icon}`
    };
    result.push(augment);
  }

  return result;
};

export default mapAugments;
