import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const getCompsFromDbTest = async () => {
    const result = [];
    const comps = await prisma.compositionJSON.findMany();
    for (const comp of comps) {
        const jsonString = comp.json;
        console.log(jsonString);
        const composition = JSON.parse(jsonString);
        result.push(composition);
    }
    return result;
};
export default getCompsFromDbTest;
