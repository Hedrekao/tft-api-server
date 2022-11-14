import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const getCompsFromDb = async () => {
    const result = [];
    const comps = await prisma.compositionJSON.findMany();
    for (const comp of comps) {
        if (comp.visibility) {
            const jsonString = comp.json;
            const composition = JSON.parse(jsonString);
            result.push(composition);
        }
    }
    return result;
};
export default getCompsFromDb;
