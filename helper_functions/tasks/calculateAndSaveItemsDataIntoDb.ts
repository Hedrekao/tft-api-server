import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const calculateAndSaveItemsDataIntoDb = async (
  itemsObject: Object,
  numberOfComps: number
) => {
  for (const id in itemsObject) {
    try {
      const item = await prisma.items_ranking.upsert({
        where: {
          id: parseInt(id)
        },
        update: {
          avg_place: (
            itemsObject[id]['sumOfPlacement'] / itemsObject[id]['frequency']
          ).toFixed(2),
          winrate: (
            (itemsObject[id]['winrate'] / itemsObject[id]['frequency']) *
            100
          ).toFixed(2),
          frequency: (
            (itemsObject[id]['frequency'] / numberOfComps) *
            100
          ).toFixed(2)
        },
        create: {
          id: parseInt(id),
          avg_place: (
            itemsObject[id]['sumOfPlacement'] / itemsObject[id]['frequency']
          ).toFixed(2),
          winrate: (
            (itemsObject[id]['winrate'] / itemsObject[id]['frequency']) *
            100
          ).toFixed(2),
          frequency: (
            (itemsObject[id]['frequency'] / numberOfComps) *
            100
          ).toFixed(2)
        }
      });
    } catch (error: any) {
      console.log(error.message);
    }
  }
};

export default calculateAndSaveItemsDataIntoDb;
