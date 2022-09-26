import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const calculateAndSaveItemsDataIntoDb = async (itemsObject) => {
    for (const id in itemsObject) {
        try {
            const numOfRecords = await prisma.items_ranking.count({
                where: { id: parseInt(id) }
            });
            if (numOfRecords == 1) {
                await prisma.items_ranking.update({
                    where: { id: parseInt(id) },
                    data: {
                        sumOfPlacements: {
                            increment: itemsObject[id]['sumOfPlacement']
                        },
                        sumOfWins: { increment: itemsObject[id]['winrate'] },
                        numberOfAppearances: {
                            increment: itemsObject[id]['frequency']
                        }
                    }
                });
            }
            else {
                await prisma.items_ranking.create({
                    data: {
                        id: parseInt(id),
                        sumOfPlacements: itemsObject[id]['sumOfPlacement'],
                        numberOfAppearances: itemsObject[id]['frequency'],
                        sumOfWins: itemsObject[id]['winrate']
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
