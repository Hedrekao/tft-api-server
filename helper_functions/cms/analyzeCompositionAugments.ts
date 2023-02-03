import { Augment, Comp } from '../../types/classes.js';

const analyzeCompositionAugments = (
  augmentsData: AugmentsData,
  composition: Comp,
  numberOfMatchingComps: number,
  dataDragon: DataDragon | undefined
) => {
  const augments: Array<Augment> = [];
  const set8Data = dataDragon?.augments;

  for (const augmentData in augmentsData) {
    const avgPlace = parseFloat(
      (
        augmentsData[augmentData].sumOfPlacements /
        augmentsData[augmentData].numberOfComps
      ).toFixed(2)
    );
    const winRate = parseFloat(
      (
        (augmentsData[augmentData].numberOfWins /
          augmentsData[augmentData].numberOfComps) *
        100
      ).toFixed(2)
    );
    const playRate = parseFloat(
      (
        (augmentsData[augmentData].numberOfComps / numberOfMatchingComps) *
        100
      ).toFixed(2)
    );

    const dataDragonItem = set8Data![augmentData];
    const iconWithWrongExt = dataDragonItem?.icon.toLowerCase();
    let icon = iconWithWrongExt
      ?.substring(0, iconWithWrongExt.length - 3)
      .concat('png');
    icon = icon.replace('hexcore', 'choiceui');

    const augment = new Augment(
      `https://raw.communitydragon.org/latest/game/${icon}`,
      dataDragonItem.name,
      avgPlace,
      winRate,
      playRate
    );
    augments.push(augment);
  }

  augments.sort((a, b) => {
    if (a.frequency > 1 && b.frequency < 1) {
      return -1;
    } else if (a.frequency < 1 && b.frequency > 1) {
      return 1;
    } else {
      if (a.avgPlacement < b.avgPlacement) {
        return -1;
      } else if (a.avgPlacement > b.avgPlacement) {
        return 1;
      } else {
        if (a.winrate > b.winrate) {
          return -1;
        } else if (a.winrate < b.winrate) {
          return 1;
        }
      }
    }
    return 0;
  });

  composition.augments = augments;
};

export default analyzeCompositionAugments;
