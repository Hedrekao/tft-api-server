import { PrismaClient } from '@prisma/client';
import { saveAugmentsAndItemsIntoDatabase } from '../helper_functions/cms/saveAugmentsAndItemsIntoDb.js';
import { refreshMultipleCompsData } from '../helper_functions/cms/refreshMultipleCompsData.js';

const prisma = new PrismaClient();
export async function refreshAllCompsData() {
  const compsFromDb = await prisma.compositionJSON.findMany();

  const input = compsFromDb.map((compFromDb) => ({
    compId: compFromDb.id,
    comp: JSON.parse(compFromDb.json as string),
    previousNumberOfComps: compFromDb.numberOfCompsFound,
    currentNumberOfComps: 0,
    itemsData: {} as ItemsDataCMS,
    augmentData: {} as AugmentsData,
    variationPerformance: [],
    placementOverall: 0,
    top4Count: 0,
    winCount: 0
  }));

  const totalNumberOfMatches = await refreshMultipleCompsData(input);

  if (totalNumberOfMatches == undefined) return;

  for (const comp of input) {
    await prisma.compsUnits.deleteMany({
      where: { compId: comp.compId }
    });

    await prisma.compsAugments.deleteMany({
      where: { compId: comp.compId }
    });
    const compJSON = JSON.stringify(comp.comp);
    await prisma.compositionJSON.update({
      where: { id: comp.compId },
      data: {
        json: compJSON,
        numberOfCompsFound: comp.currentNumberOfComps,
        totalNumberOfMatches: totalNumberOfMatches
      }
    });

    await saveAugmentsAndItemsIntoDatabase(
      comp.compId,
      comp.augmentData,
      comp.itemsData,
      comp.comp.units,
      prisma
    );
  }
}
