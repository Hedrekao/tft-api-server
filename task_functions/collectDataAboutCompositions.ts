import { PrismaClient } from '@prisma/client';
import { Comp } from '../types/classes.js';
import { reanalyzeComps } from '../helper_functions/tasks/reanalyzeCompositions.js';

const prisma = new PrismaClient();

export async function collectDataAboutCompositions() {
  try {
    const compsFromDb = await prisma.compositionJSON.findMany();

    const input = compsFromDb.map((compFromDb) => ({
      compId: compFromDb.id,
      comp: JSON.parse(compFromDb.json) as Comp,
      previousNumberOfComps: compFromDb.numberOfCompsFound,
      currentNumberOfComps: 0,
      previousTotalNumberOfMatches: compFromDb.totalNumberOfMatches,
      itemsData: {} as ItemsDataCMS,
      augmentData: {} as AugmentsData,
      variationPerformance: [],
      placementOverall: 0,
      top4Count: 0,
      winCount: 0
    }));

    const totalNumberOfMatches = await reanalyzeComps(input);

    if (!totalNumberOfMatches) return;

    for (const comp of input) {
      const compJSON = JSON.stringify(comp.comp);
      await prisma.compositionJSON.update({
        where: { id: comp.compId },
        data: {
          json: compJSON,
          numberOfCompsFound:
            comp.previousNumberOfComps + comp.currentNumberOfComps,
          totalNumberOfMatches: { increment: totalNumberOfMatches }
        }
      });
    }
  } catch (error: any) {
    console.log(`reanalyze error - ${error.message}`);
  }
}
