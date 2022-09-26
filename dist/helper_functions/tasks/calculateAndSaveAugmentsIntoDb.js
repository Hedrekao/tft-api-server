import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const calculateAndSaveAugmentsDataIntoDb = async (augmentsObject) => {
    try {
        for (const id in augmentsObject) {
            const numOfRecords = await prisma.augments_ranking.count({
                where: { id: id }
            });
            if (numOfRecords == 1) {
                await prisma.augments_ranking.update({
                    where: { id: id },
                    data: {
                        sumOfPlacements: {
                            increment: augmentsObject[id]['sumOfPlacement']
                        },
                        sumOfWins: { increment: augmentsObject[id]['winrate'] },
                        numberOfAppearances: {
                            increment: augmentsObject[id]['frequency']
                        }
                    }
                });
            }
            else {
                await prisma.augments_ranking.create({
                    data: {
                        id: id,
                        sumOfPlacements: augmentsObject[id]['sumOfPlacement'],
                        numberOfAppearances: augmentsObject[id]['frequency'],
                        sumOfWins: augmentsObject[id]['winrate']
                    }
                });
            }
        }
    }
    catch (error) {
        console.log(error.message);
    }
};
export default calculateAndSaveAugmentsDataIntoDb;
