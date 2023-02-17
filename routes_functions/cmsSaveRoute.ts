import { PrismaClient } from '@prisma/client';
import { Comp } from 'types/classes';
import getItemsAndAugmentsAndVariationsPerformance from '../helper_functions/cms/getItemsAndAugmentsAndVariationsPerformance.js';

const prisma = new PrismaClient();

const saveCompositionIntoDatabase = async (composition: Comp) => {
  try {
    const numberOfMatchingComps =
      await getItemsAndAugmentsAndVariationsPerformance(composition);

    if (typeof numberOfMatchingComps == 'object') {
      throw new Error('Something went wrong');
    }
    const compositionJSON = JSON.stringify(composition);
    await prisma.compositionJSON.create({
      data: { json: compositionJSON, numberOfCompsFound: numberOfMatchingComps }
    });
  } catch (error: any) {
    console.log(error.message);
  }
};

export default saveCompositionIntoDatabase;
