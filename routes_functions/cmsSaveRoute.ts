import { PrismaClient } from '@prisma/client';
import { Comp } from 'types/classes';
import getItemsAndAugmentsAndVariationsPerformance from '../helper_functions/cms/getItemsAndAugmentsAndVariationsPerformance.js';

const prisma = new PrismaClient();

const saveCompositionIntoDatabase = async (composition: Comp) => {
  await getItemsAndAugmentsAndVariationsPerformance(composition);

  const compositionJSON = JSON.stringify(composition);
  await prisma.compositionJSON.create({ data: { json: compositionJSON } });
};

export default saveCompositionIntoDatabase;
