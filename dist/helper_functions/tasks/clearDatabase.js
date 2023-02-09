import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export async function clearDatabase() {
    await prisma.general_data.deleteMany();
    await prisma.augments_ranking.deleteMany();
    await prisma.augments_first_choice_ranking.deleteMany();
    await prisma.augments_second_choice_ranking.deleteMany();
    await prisma.augments_third_choice_ranking.deleteMany();
    await prisma.items_ranking.deleteMany();
    await prisma.champions_ranking.deleteMany();
}
