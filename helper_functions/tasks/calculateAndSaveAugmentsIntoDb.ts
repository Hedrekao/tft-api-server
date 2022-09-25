import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const calculateAndSaveAugmentsDataIntoDb = async (
  augmentsObject: Object,
  numberOfComps: number
) => {
  for (const id in augmentsObject) {
    try {
      const augment = await prisma.augments_ranking.upsert({
        where: {
          id: id
        },
        update: {
          avg_place: (
            augmentsObject[id]['sumOfPlacement'] /
            augmentsObject[id]['frequency']
          ).toFixed(2),
          winrate: (
            (augmentsObject[id]['winrate'] / augmentsObject[id]['frequency']) *
            100
          ).toFixed(2),
          frequency: (
            (augmentsObject[id]['frequency'] / numberOfComps) *
            100
          ).toFixed(2)
        },
        create: {
          id: id,
          avg_place: (
            augmentsObject[id]['sumOfPlacement'] /
            augmentsObject[id]['frequency']
          ).toFixed(2),
          winrate: (
            (augmentsObject[id]['winrate'] / augmentsObject[id]['frequency']) *
            100
          ).toFixed(2),
          frequency: (
            (augmentsObject[id]['frequency'] / numberOfComps) *
            100
          ).toFixed(2)
        }
      });
    } catch (error: any) {
      console.log(error.message);
    }
  }
};

export default calculateAndSaveAugmentsDataIntoDb;
