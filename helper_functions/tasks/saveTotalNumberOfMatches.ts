import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const saveTotalNumberOfMatches = async (
  totalNumberOfMatches: number,
  totalNumberOfComps: number
) => {
  const numOfRecords = await prisma.general_data.count();

  if (numOfRecords == 1) {
    await prisma.general_data.update({
      where: { id: 1 },
      data: {
        totalNumberOfMatches: { increment: totalNumberOfMatches },
        totalNumberOfComps: { increment: totalNumberOfComps }
      }
    });
  } else {
    await prisma.general_data.create({
      data: {
        id: 1,
        totalNumberOfMatches: totalNumberOfMatches,
        totalNumberOfComps: totalNumberOfComps
      }
    });
  }
};

export default saveTotalNumberOfMatches;
