import { PrismaClient } from '@prisma/client';
import { refreshMultipleCompsData } from '../helper_functions/cms/refreshMultipleCompsData.js';
const prisma = new PrismaClient();
export async function refreshAllCompsData() {
    const compsFromDb = await prisma.compositionJSON.findMany();
    const input = compsFromDb.map((compFromDb) => ({
        compId: compFromDb.id,
        comp: JSON.parse(compFromDb.json),
        previousNumberOfComps: compFromDb.numberOfCompsFound,
        currentNumberOfComps: 0,
        itemsData: {},
        augmentData: {},
        variationPerformance: [],
        placementOverall: 0,
        top4Count: 0,
        winCount: 0
    }));
    await refreshMultipleCompsData(input);
    for (const comp of input) {
        const compJSON = JSON.stringify(comp.comp);
        await prisma.compositionJSON.update({
            where: { id: comp.compId },
            data: {
                json: compJSON,
                numberOfCompsFound: comp.currentNumberOfComps
            }
        });
    }
}
