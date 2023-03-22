import { PrismaClient } from '@prisma/client';
import { getDataDragonItemInfo } from '../getDataDragonItemInfo.js';
const prisma = new PrismaClient();
const calculateAndSaveItemsDataIntoDb = async (itemsObject, dataDragon) => {
    const set8DataItems = dataDragon?.items;
    if (set8DataItems == undefined)
        return;
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
            }
            else {
                const { name, src, type } = getDataDragonItemInfo(set8DataItems, id);
                await prisma.items_ranking.create({
                    data: {
                        id: id,
                        sumOfPlacements: itemsObject[id].sumOfPlacements,
                        numberOfAppearances: itemsObject[id].numberOfComps,
                        sumOfWins: itemsObject[id].numberOfWins,
                        icon: src,
                        name: name,
                        type: type
                    }
                });
            }
        }
        catch (error) {
            console.log(error.message);
        }
    }
};
export default calculateAndSaveItemsDataIntoDb;
