import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const saveTotalNumberOfMatches = async (totalNumberOfMatches, totalNumberOfComps, gameVersion) => {
    const numOfRecords = await prisma.general_data.count();
    if (numOfRecords == 1) {
        await prisma.general_data.update({
            where: { id: 1 },
            data: {
                totalNumberOfMatches: { increment: totalNumberOfMatches },
                totalNumberOfComps: { increment: totalNumberOfComps },
                lastChange: Date.now(),
                gameVersion: gameVersion
            }
        });
    }
    else {
        if (gameVersion == undefined)
            return;
        await prisma.general_data.create({
            data: {
                id: 1,
                totalNumberOfMatches: totalNumberOfMatches,
                totalNumberOfComps: totalNumberOfComps,
                lastChange: Date.now(),
                gameVersion: gameVersion
            }
        });
    }
};
export default saveTotalNumberOfMatches;
