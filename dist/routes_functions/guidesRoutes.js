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
    const correctTitle = title.replaceAll('-', ' ');
    const guide = await prisma.guides.findMany({
        where: {
            title: { equals: correctTitle, mode: 'insensitive' }
        },
        include: { elements: true }
    });
    if (!guide.length)
        return null;
    guide[0]?.elements.sort((a, b) => a.order - b.order);
    return guide[0];
}
export async function saveGuide(guide) {
    const prisma = new PrismaClient();
    const currentDate = new Date();
    const options = {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    };
    const formattedDate = currentDate.toLocaleString('en-US', options);
    const guideData = {
        ...guide,
        date: formattedDate,
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
