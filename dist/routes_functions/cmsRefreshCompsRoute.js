import { PrismaClient } from '@prisma/client';
import { refreshSingularCompData } from '../helper_functions/cms/refreshSingularCompData.js';
const prisma = new PrismaClient();
export async function refreshCompsData(id) {
    const compDb = await prisma.compositionJSON.findUnique({
        where: { id: parseInt(id) }
    });
    if (compDb == null)
        return;
    const comp = JSON.parse(compDb.json);
    const numberOfMatchingComps = await refreshSingularCompData(comp);
    if (typeof numberOfMatchingComps == 'object') {
        throw new Error('Something went wrong');
    }
    const compositionJSON = JSON.stringify(comp);
    await prisma.compositionJSON.update({
        where: { id: parseInt(id) },
        data: { json: compositionJSON, numberOfCompsFound: numberOfMatchingComps }
    });
}
