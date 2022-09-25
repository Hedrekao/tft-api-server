import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const calculateAndSaveUnitsDataIntoDb = async (unitsObject, numberOfComps) => {
    for (const id in unitsObject) {
        try {
            const unit = await prisma.champions_ranking.upsert({
                where: {
                    id: id
                },
                update: {
                    avg_place: (unitsObject[id]['sumOfPlacement'] / unitsObject[id]['frequency']).toFixed(2),
                    winrate: ((unitsObject[id]['winrate'] / unitsObject[id]['frequency']) *
                        100).toFixed(2),
                    frequency: ((unitsObject[id]['frequency'] / numberOfComps) *
                        100).toFixed(2)
                },
                create: {
                    id: id,
                    avg_place: (unitsObject[id]['sumOfPlacement'] / unitsObject[id]['frequency']).toFixed(2),
                    winrate: ((unitsObject[id]['winrate'] / unitsObject[id]['frequency']) *
                        100).toFixed(2),
                    frequency: ((unitsObject[id]['frequency'] / numberOfComps) *
                        100).toFixed(2)
                }
            });
        }
        catch (error) {
            console.log(error.message);
        }
    }
};
export default calculateAndSaveUnitsDataIntoDb;
