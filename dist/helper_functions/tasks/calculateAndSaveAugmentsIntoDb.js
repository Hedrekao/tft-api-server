import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const calculateAndSaveAugmentsDataIntoDb = async (augmentsObject, firstChoiceAugmentObject, secondChoiceAugmentObject, thirdChoiceAugmentObject, dataDragon) => {
    try {
        const set8Data = dataDragon?.augments;
        for (const id in augmentsObject) {
            const numOfRecords = await prisma.augments_ranking.count({
                where: { id: id }
            });
            if (numOfRecords == 1) {
                await prisma.augments_ranking.update({
                    where: { id: id },
                    data: {
                        sumOfPlacements: {
                            increment: augmentsObject[id].sumOfPlacements
                        },
                        sumOfWins: { increment: augmentsObject[id].numberOfWins },
                        numberOfAppearances: {
                            increment: augmentsObject[id].numberOfComps
                        }
                    }
                });
            }
            else {
                const dataDragonItem = set8Data[id];
                const iconWithWrongExt = dataDragonItem?.icon.toLowerCase();
                let src = iconWithWrongExt
                    ?.substring(0, iconWithWrongExt.length - 3)
                    .concat('png');
                src = src?.replace('hexcore', 'choiceui');
                const name = dataDragonItem.name;
                await prisma.augments_ranking.create({
                    data: {
                        id: id,
                        name: name,
                        icon: `https://raw.communitydragon.org/latest/game/${src}`,
                        sumOfPlacements: augmentsObject[id].sumOfPlacements,
                        numberOfAppearances: augmentsObject[id].numberOfComps,
                        sumOfWins: augmentsObject[id].numberOfWins
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
                            increment: firstChoiceAugmentObject[id].sumOfPlacements
                        },
                        sumOfWins: { increment: firstChoiceAugmentObject[id].numberOfWins },
                        numberOfAppearances: {
                            increment: firstChoiceAugmentObject[id].numberOfComps
                        }
                    }
                });
            }
            else {
                const dataDragonItem = set8Data[id];
                const iconWithWrongExt = dataDragonItem?.icon.toLowerCase();
                let src = iconWithWrongExt
                    ?.substring(0, iconWithWrongExt.length - 3)
                    .concat('png');
                src = src?.replace('hexcore', 'choiceui');
                const name = dataDragonItem.name;
                await prisma.augments_first_choice_ranking.create({
                    data: {
                        id: id,
                        name: name,
                        icon: `https://raw.communitydragon.org/latest/game/${src}`,
                        sumOfPlacements: firstChoiceAugmentObject[id].sumOfPlacements,
                        numberOfAppearances: firstChoiceAugmentObject[id].numberOfComps,
                        sumOfWins: firstChoiceAugmentObject[id].numberOfWins
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
                            increment: secondChoiceAugmentObject[id].sumOfPlacements
                        },
                        sumOfWins: {
                            increment: secondChoiceAugmentObject[id].numberOfWins
                        },
                        numberOfAppearances: {
                            increment: secondChoiceAugmentObject[id].numberOfComps
                        }
                    }
                });
            }
            else {
                const dataDragonItem = set8Data[id];
                const iconWithWrongExt = dataDragonItem?.icon.toLowerCase();
                let src = iconWithWrongExt
                    ?.substring(0, iconWithWrongExt.length - 3)
                    .concat('png');
                src = src?.replace('hexcore', 'choiceui');
                const name = dataDragonItem.name;
                await prisma.augments_second_choice_ranking.create({
                    data: {
                        id: id,
                        name: name,
                        icon: `https://raw.communitydragon.org/latest/game/${src}`,
                        sumOfPlacements: secondChoiceAugmentObject[id].sumOfPlacements,
                        numberOfAppearances: secondChoiceAugmentObject[id].numberOfComps,
                        sumOfWins: secondChoiceAugmentObject[id].numberOfWins
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
                            increment: thirdChoiceAugmentObject[id].sumOfPlacements
                        },
                        sumOfWins: { increment: thirdChoiceAugmentObject[id].numberOfWins },
                        numberOfAppearances: {
                            increment: thirdChoiceAugmentObject[id].numberOfComps
                        }
                    }
                });
            }
            else {
                const dataDragonItem = set8Data[id];
                const iconWithWrongExt = dataDragonItem?.icon.toLowerCase();
                let src = iconWithWrongExt
                    ?.substring(0, iconWithWrongExt.length - 3)
                    .concat('png');
                src = src?.replace('hexcore', 'choiceui');
                const name = dataDragonItem.name;
                await prisma.augments_third_choice_ranking.create({
                    data: {
                        id: id,
                        name: name,
                        icon: `https://raw.communitydragon.org/latest/game/${src}`,
                        sumOfPlacements: thirdChoiceAugmentObject[id].sumOfPlacements,
                        numberOfAppearances: thirdChoiceAugmentObject[id].numberOfComps,
                        sumOfWins: thirdChoiceAugmentObject[id].numberOfWins
                    }
                });
            }
        }
    }
    catch (error) {
        console.log(error.message);
    }
};
export default calculateAndSaveAugmentsDataIntoDb;
