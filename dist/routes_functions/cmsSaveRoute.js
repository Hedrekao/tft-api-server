import { PrismaClient } from '@prisma/client';
import getItemsAndAugmentsAndVariationsPerformance from '../helper_functions/cms/getItemsAndAugmentsAndVariationsPerformance.js';
const prisma = new PrismaClient();
const saveCompositionIntoDatabase = async (composition) => {
    try {
        await getItemsAndAugmentsAndVariationsPerformance(composition);
        const compositionJSON = JSON.stringify(composition);
        await prisma.compositionJSON.create({ data: { json: compositionJSON } });
    }
    catch (error) {
        console.log(error.message);
    }
};
export default saveCompositionIntoDatabase;
