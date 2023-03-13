import { PrismaClient } from '@prisma/client';
export async function getAllGuidesWithoutDetails() {
    const prisma = new PrismaClient();
    return (await prisma.guides.findMany({
        select: {
            title: true,
            description: true,
            set: true,
            timeRead: true,
            date: true,
            imageUrl: true,
            borderColorUnitCost: true,
            elements: false
        }
    }));
}
export async function getGuideByTitle(title) {
    const prisma = new PrismaClient();
    const guide = await prisma.guides.findUnique({
        where: { title: title },
        include: { elements: true }
    });
    guide?.elements.sort((a, b) => a.order - b.order);
    return guide;
}
export async function saveGuide(guide) {
    const prisma = new PrismaClient();
    const guideData = {
        ...guide,
        elements: {
            create: guide.elements.map((element, index) => ({
                ...element,
                order: index
            }))
        }
    };
    return await prisma.guides.create({
        data: guideData
    });
}
