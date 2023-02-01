import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const calculateAndSaveItemsDataIntoDb = async (
  itemsObject: CronTaskData,
  dataDragon: DataDragon | undefined
) => {
  const set8DataItems = dataDragon?.items;

  for (const id in itemsObject) {
    try {
      const numOfRecords = await prisma.items_ranking.count({
        where: { id: id }
      });
      if (numOfRecords == 1) {
        await prisma.items_ranking.update({
          where: { id: id },
          data: {
            sumOfPlacements: {
              increment: itemsObject[id].sumOfPlacements
            },
            sumOfWins: { increment: itemsObject[id].numberOfWins },
            numberOfAppearances: {
              increment: itemsObject[id].numberOfComps
            }
          }
        });
      } else {
        const dataDragonItem = set8DataItems![id];
        const iconWithWrongExt = dataDragonItem?.icon.toLowerCase();
        const icon = iconWithWrongExt
          ?.substring(0, iconWithWrongExt.length - 3)
          .concat('png');
        await prisma.items_ranking.create({
          data: {
            id: id,
            sumOfPlacements: itemsObject[id].sumOfPlacements,
            numberOfAppearances: itemsObject[id].numberOfComps,
            sumOfWins: itemsObject[id].numberOfWins,
            icon: icon,
            name: dataDragonItem.name
          }
        });
      }
    } catch (error: any) {
      console.log(error.message);
    }
  }
};

export default calculateAndSaveItemsDataIntoDb;
