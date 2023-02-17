import { PrismaClient } from '@prisma/client';
import { refreshSingularCompData } from '../helper_functions/cms/refreshSingularCompData.js';
import { Comp } from 'types/classes';

const prisma = new PrismaClient();
export async function refreshCompsData(id: string) {
  const compDb = await prisma.compositionJSON.findUnique({
    where: { id: parseInt(id) }
  });

  if (compDb == null) return;

  const comp: Comp = JSON.parse(compDb.json as string);

  await refreshSingularCompData(comp);

  const compositionJSON = JSON.stringify(comp);

  await prisma.compositionJSON.update({
    where: { id: parseInt(id) },
    data: { json: compositionJSON }
  });
}
