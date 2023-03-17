import { PrismaClient } from '@prisma/client';
import { refreshSingularCompData } from '../helper_functions/cms/refreshSingularCompData.js';
import { Comp } from 'types/classes';
import { saveAugmentsAndItemsIntoDatabase } from '../helper_functions/cms/saveAugmentsAndItemsIntoDb.js';

const prisma = new PrismaClient();
export async function refreshCompsData(id: string) {
  const compDb = await prisma.compositionJSON.findUnique({
    where: { id: parseInt(id) }
  });

  if (compDb == null) return;

  await prisma.compsUnits.deleteMany({
    where: { compId: parseInt(id) }
  });

  await prisma.compsAugments.deleteMany({
    where: { compId: parseInt(id) }
  });

  const comp: Comp = JSON.parse(compDb.json as string);

  const result = await refreshSingularCompData(comp);

  if (result.error) {
    throw new Error('Something went wrong');
  }

  const compositionJSON = JSON.stringify(comp);

  await prisma.compositionJSON.update({
    where: { id: parseInt(id) },
    data: {
      json: compositionJSON,
      numberOfCompsFound: result.numberOfAugmentMatchingComps,
      totalNumberOfMatches: result.totalNumberOfMatchesOverall
    }
  });

  if (result.augmentData && result.itemsData) {
    await saveAugmentsAndItemsIntoDatabase(
      compDb.id,
      result.augmentData,
      result.itemsData,
      comp.units,
      prisma
    );
  }
}
