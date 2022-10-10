import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const calculateAndSaveAugmentsDataIntoDb = async (
  augmentsObject: Object,
  firstChoiceAugmentObject: Object,
  secondChoiceAugmentObject: Object,
  thirdChoiceAugmentObject: Object
) => {
  try {
    for (const id in augmentsObject) {
      const numOfRecords = await prisma.augments_ranking.count({
        where: { id: id }
      });
      if (numOfRecords == 1) {
        await prisma.augments_ranking.update({
          where: { id: id },
          data: {
            sumOfPlacements: {
              increment: augmentsObject[id]['sumOfPlacement']
            },
            sumOfWins: { increment: augmentsObject[id]['winrate'] },
            numberOfAppearances: {
              increment: augmentsObject[id]['frequency']
            }
          }
        });
      } else {
        await prisma.augments_ranking.create({
          data: {
            id: id,
            sumOfPlacements: augmentsObject[id]['sumOfPlacement'],
            numberOfAppearances: augmentsObject[id]['frequency'],
            sumOfWins: augmentsObject[id]['winrate']
          }
        });
      }
    }

    for (const id in firstChoiceAugmentObject) {
      const numOfRecords = await prisma.augments_first_choice_ranking.count({
        where: { id: id }
      });
      if (numOfRecords == 1) {
        await prisma.augments_first_choice_ranking.update({
          where: { id: id },
          data: {
            sumOfPlacements: {
              increment: firstChoiceAugmentObject[id]['sumOfPlacement']
            },
            sumOfWins: { increment: firstChoiceAugmentObject[id]['winrate'] },
            numberOfAppearances: {
              increment: firstChoiceAugmentObject[id]['frequency']
            }
          }
        });
      } else {
        await prisma.augments_first_choice_ranking.create({
          data: {
            id: id,
            sumOfPlacements: firstChoiceAugmentObject[id]['sumOfPlacement'],
            numberOfAppearances: firstChoiceAugmentObject[id]['frequency'],
            sumOfWins: firstChoiceAugmentObject[id]['winrate']
          }
        });
      }
    }

    for (const id in secondChoiceAugmentObject) {
      const numOfRecords = await prisma.augments_second_choice_ranking.count({
        where: { id: id }
      });
      if (numOfRecords == 1) {
        await prisma.augments_second_choice_ranking.update({
          where: { id: id },
          data: {
            sumOfPlacements: {
              increment: secondChoiceAugmentObject[id]['sumOfPlacement']
            },
            sumOfWins: { increment: secondChoiceAugmentObject[id]['winrate'] },
            numberOfAppearances: {
              increment: secondChoiceAugmentObject[id]['frequency']
            }
          }
        });
      } else {
        await prisma.augments_second_choice_ranking.create({
          data: {
            id: id,
            sumOfPlacements: secondChoiceAugmentObject[id]['sumOfPlacement'],
            numberOfAppearances: secondChoiceAugmentObject[id]['frequency'],
            sumOfWins: secondChoiceAugmentObject[id]['winrate']
          }
        });
      }
    }

    for (const id in thirdChoiceAugmentObject) {
      const numOfRecords = await prisma.augments_third_choice_ranking.count({
        where: { id: id }
      });
      if (numOfRecords == 1) {
        await prisma.augments_third_choice_ranking.update({
          where: { id: id },
          data: {
            sumOfPlacements: {
              increment: thirdChoiceAugmentObject[id]['sumOfPlacement']
            },
            sumOfWins: { increment: thirdChoiceAugmentObject[id]['winrate'] },
            numberOfAppearances: {
              increment: thirdChoiceAugmentObject[id]['frequency']
            }
          }
        });
      } else {
        await prisma.augments_third_choice_ranking.create({
          data: {
            id: id,
            sumOfPlacements: thirdChoiceAugmentObject[id]['sumOfPlacement'],
            numberOfAppearances: thirdChoiceAugmentObject[id]['frequency'],
            sumOfWins: thirdChoiceAugmentObject[id]['winrate']
          }
        });
      }
    }
  } catch (error: any) {
    console.log(error.message);
  }
};

export default calculateAndSaveAugmentsDataIntoDb;
