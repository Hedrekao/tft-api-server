import { PrismaClient } from '@prisma/client';
import { refreshSingularCompData } from '../helper_functions/cms/refreshSingularCompData.js';
const prisma = new PrismaClient();
export async function refreshAllCompsData() {
    const compsDb = await prisma.compositionJSON.findMany();
    for (const compDb of compsDb) {
        const comp = JSON.parse(compDb.json);
        await refreshSingularCompData(comp);
        const compositionJSON = JSON.stringify(comp);
        await prisma.compositionJSON.update({
            where: { id: compDb.id },
            data: { json: compositionJSON }
        });
    }
}
