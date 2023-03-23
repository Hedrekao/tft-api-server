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
  })) as Guide[];
}

export async function getGuideByTitle(title: string) {
  const prisma = new PrismaClient();
  const correctTitle = title.replaceAll('-', ' ');
  const guide = await prisma.guides.findMany({
    where: {
      title: { equals: correctTitle, mode: 'insensitive' }
    },
    include: { elements: true }
  });

  if (!guide.length) return null;

  guide[0]?.elements.sort((a, b) => a.order - b.order);

  return guide[0] as Guide;
}

export async function deleteGuide(title: string) {
  const prisma = new PrismaClient();
  const correctTitle = title.replaceAll('-', ' ');

  await prisma.guides.deleteMany({
    where: {
      title: { equals: correctTitle, mode: 'insensitive' }
    }
  });

  return true;
}

export async function saveGuide(guide: Guide) {
  const prisma = new PrismaClient();
  const currentDate = new Date();
  const options: Intl.DateTimeFormatOptions = {
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
