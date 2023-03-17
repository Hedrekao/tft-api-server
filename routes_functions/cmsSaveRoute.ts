import { PrismaClient } from '@prisma/client';
import { saveAugmentsAndItemsIntoDatabase } from '../helper_functions/cms/saveAugmentsAndItemsIntoDb.js';
import { Comp } from 'types/classes';
import getItemsAndAugmentsAndVariationsPerformance from '../helper_functions/cms/getItemsAndAugmentsAndVariationsPerformance.js';

const prisma = new PrismaClient();

const saveCompositionIntoDatabase = async (composition: Comp) => {
  try {
    const result = await getItemsAndAugmentsAndVariationsPerformance(
      composition
    );

    if (result.error) {
      throw new Error('Something went wrong');
    }
    const compositionJSON = JSON.stringify(composition);
    const comp = await prisma.compositionJSON.create({
      data: {
        json: compositionJSON,
        numberOfCompsFound: result.numberOfAugmentMatchingComps,
        totalNumberOfMatches: result.totalNumberOfMatchesOverall
      }
    });
    if (result.augmentData && result.itemsData) {
      saveAugmentsAndItemsIntoDatabase(
        comp.id,
        result.augmentData,
        result.itemsData,
        composition.units,
        prisma
      );
    }
  } catch (error: any) {
    console.log(error.message);
  }
};

export default saveCompositionIntoDatabase;
