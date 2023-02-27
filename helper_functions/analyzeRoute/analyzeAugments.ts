const analyzeAugments = (
  augmentsData: AugmentsData,
  numberOfMatchingComps: number,
  dataDragon: DataDragon | undefined
) => {
  const result = [];
  const set8Data = dataDragon?.augments;
  for (const augmentData in augmentsData) {
    const dataDragonItem = set8Data![augmentData];
    const iconWithWrongExt = dataDragonItem?.icon.toLowerCase();
    let src = iconWithWrongExt
      ?.substring(0, iconWithWrongExt.length - 3)
      .concat('png');
    src = src?.replace('hexcore', 'choiceui');

    const name = dataDragonItem.name;

    const augment = {
      apiName: augmentData,
      name: name,
      src: `https://raw.communitydragon.org/latest/game/${src}`,
      avgPlace: (
        augmentsData[augmentData].sumOfPlacements /
        augmentsData[augmentData].numberOfComps
      ).toFixed(2),
      winRate: (
        (augmentsData[augmentData].numberOfWins /
          augmentsData[augmentData].numberOfComps) *
        100
      ).toFixed(2),
      playRate: (
        (augmentsData[augmentData].numberOfComps / numberOfMatchingComps) *
        100
      ).toFixed(2)
    };
    result.push(augment);
  }

  result.sort((a, b) => {
    if (parseFloat(a.playRate) > 1 && parseFloat(b.playRate) < 1) {
      return -1;
    } else if (parseFloat(a.playRate) < 1 && parseFloat(b.playRate) > 1) {
      return 1;
    } else {
      if (parseFloat(a.avgPlace) < parseFloat(b.avgPlace)) {
        return -1;
      } else if (parseFloat(a.avgPlace) > parseFloat(b.avgPlace)) {
        return 1;
      } else {
        if (parseFloat(a.winRate) > parseFloat(b.winRate)) {
          return -1;
        } else if (parseFloat(a.winRate) < parseFloat(b.winRate)) {
          return 1;
        }
      }
    }
    return 0;
  });
  return result;
};

export default analyzeAugments;
