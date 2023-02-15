import { PrismaClient } from '@prisma/client';
import { Comp } from 'types/classes';
import find4MostFrequentItemsOnCoreUnits from '../helper_functions/cms/getItemsAndAugmentsAndVariationsPerformance.js';

const prisma = new PrismaClient();
export async function refreshCompsData(id: string) {
  const compDb = await prisma.compositionJSON.findUnique({
    where: { id: parseInt(id) }
  });

  if (compDb == null) return;

  const comp: Comp = JSON.parse(compDb.json as string);

  await find4MostFrequentItemsOnCoreUnits(comp);

  const compositionJSON = JSON.stringify(comp);

  await prisma.compositionJSON.update({
    where: { id: parseInt(id) },
    data: { json: compositionJSON }
  });
}
