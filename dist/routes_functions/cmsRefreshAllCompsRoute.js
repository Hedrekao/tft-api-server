import { PrismaClient } from '@prisma/client';
import { refreshSingularCompData } from '../helper_functions/cms/refreshSingularCompData.js';
const prisma = new PrismaClient();
export async function refreshAllCompsData() {
    const compsDb = await prisma.compositionJSON.findMany();
    for (const compDb of compsDb) {
        const comp = JSON.parse(compDb.json);
        const numberOfMatchingComps = await refreshSingularCompData(comp);
        const compositionJSON = JSON.stringify(comp);
        if (typeof numberOfMatchingComps == 'object') {
            throw new Error('Something went wrong');
        }
        await prisma.compositionJSON.update({
            where: { id: compDb.id },
            data: { json: compositionJSON, numberOfCompsFound: numberOfMatchingComps }
        });
    }
}
