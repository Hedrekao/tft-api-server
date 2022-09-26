import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const calculateAndSaveUnitsDataIntoDb = async (unitsObject: Object) => {
  for (const id in unitsObject) {
    try {
      const numOfRecords = await prisma.champions_ranking.count({
        where: { id: id }
      });
      if (numOfRecords == 1) {
        await prisma.champions_ranking.update({
          where: { id: id },
          data: {
            sumOfPlacements: {
              increment: unitsObject[id]['sumOfPlacement']
            },
            sumOfWins: { increment: unitsObject[id]['winrate'] },
            numberOfAppearances: {
              increment: unitsObject[id]['frequency']
            }
          }
        });
      } else {
        await prisma.champions_ranking.create({
          data: {
            id: id,
            sumOfPlacements: unitsObject[id]['sumOfPlacement'],
            numberOfAppearances: unitsObject[id]['frequency'],
            sumOfWins: unitsObject[id]['winrate']
          }
        });
      }
    } catch (error: any) {
      console.log(error.message);
    }
  }
};

export default calculateAndSaveUnitsDataIntoDb;
