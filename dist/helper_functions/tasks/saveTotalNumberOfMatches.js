import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const saveTotalNumberOfMatches = async (totalNumberOfMatches, totalNumberOfComps) => {
    const numOfRecords = await prisma.general_data.count();
    if (numOfRecords == 1) {
        await prisma.general_data.update({
            where: { id: 1 },
            data: {
                totalNumberOfMatches: { increment: totalNumberOfMatches },
                totalNumberOfComps: { increment: totalNumberOfComps },
                lastChange: Date.now()
            }
        });
    }
    else {
        await prisma.general_data.create({
            data: {
                id: 1,
                totalNumberOfMatches: totalNumberOfMatches,
                totalNumberOfComps: totalNumberOfComps,
                lastChange: Date.now()
            }
        });
    }
};
export default saveTotalNumberOfMatches;
