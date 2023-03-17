import { PrismaClient } from '@prisma/client';
import { Unit } from '../../types/classes.js';

export async function saveAugmentsAndItemsIntoDatabase(
  compId: bigint,
  augmentsData: AugmentsData,
  itemsData: ItemsDataCMS,
  units: Unit[],
  prisma: PrismaClient
) {
  const arrayAugment = [];
  for (const augmentData in augmentsData) {
    const augment = augmentsData[augmentData];
    arrayAugment.push({
      compId,
      augmentId: augmentData,
      numOfAppear: augment.numberOfComps,
      numOfWins: augment.numberOfWins,
      sumOfPlacements: augment.sumOfPlacements
    });
  }

  await prisma.compsAugments.createMany({
    data: arrayAugment,
    skipDuplicates: true
  });

  for (const unit of units) {
    const arrayItems = [];
    for (const item in itemsData[unit.id]) {
      if (item != 'numberOfAppearances') {
        const itemData = itemsData[unit.id][item];
        arrayItems.push({
          itemId: item,
          numOfAppear: itemData.numberOfComps
        });
      }
    }
    await prisma.compsUnits.create({
      data: {
        compId: compId,
        unitId: unit.id,
        numOfAppear: itemsData[unit.id].numberOfAppearances,
        items: {
          createMany: {
            data: arrayItems,
            skipDuplicates: true
          }
        }
      }
    });
  }
}
