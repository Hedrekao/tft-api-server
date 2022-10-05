import { PrismaClient } from '@prisma/client';
import find4MostFrequentItemsOnCoreUnits from '../helper_functions/cms/find4MostFrequentItemsOnCoreUnits.js';
const prisma = new PrismaClient();
const saveCompositionIntoDatabase = async (composition) => {
    await find4MostFrequentItemsOnCoreUnits(composition);
    const compositionJSON = JSON.stringify(composition);
    await prisma.compositionJSON.create({ data: { json: compositionJSON } });
};
export default saveCompositionIntoDatabase;
