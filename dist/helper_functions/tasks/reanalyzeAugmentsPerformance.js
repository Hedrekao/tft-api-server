import { getDataDragonAugmentInfo } from '../getDataDragonAugmentInfo.js';
import { Augment } from '../../types/classes.js';
export async function reanalyzeAugmentsPerformance(compId, augmentsData, composition, numberOfMatchingComps, previousNumberOfComps, dataDragon, prisma) {
    const augments = [];
    const set8Data = dataDragon.augments;
    const currentCompAugments = await prisma.compsAugments.findMany({
        where: { compId: compId }
    });
    for (const augmentData in augmentsData) {
        const augmentNumberOfComps = augmentsData[augmentData].numberOfComps;
        const augmentNumberOfWins = augmentsData[augmentData].numberOfWins;
        const augmentSumOfPlacements = augmentsData[augmentData].sumOfPlacements;
        const dataDragonItem = set8Data[augmentData];
        if (dataDragonItem == undefined) {
            continue;
        }
        const { name, src } = getDataDragonAugmentInfo(set8Data, augmentData);
        let avgPlace;
        let winRate;
        let playRate;
        const currentAugment = currentCompAugments.find((augment) => augment.augmentId == augmentData);
        if (currentAugment) {
            avgPlace = parseFloat(((augmentSumOfPlacements + currentAugment.sumOfPlacements) /
                (augmentNumberOfComps + currentAugment.numOfAppear)).toFixed(2));
            winRate = parseFloat((((augmentNumberOfWins + currentAugment.numOfWins) /
                (augmentNumberOfComps + currentAugment.numOfAppear)) *
                100).toFixed(2));
            playRate = parseFloat((((augmentNumberOfComps + currentAugment.numOfAppear) /
                (numberOfMatchingComps + previousNumberOfComps)) *
                100).toFixed(2));
            await prisma.compsAugments.update({
                where: { compId_augmentId: { compId: compId, augmentId: augmentData } },
                data: {
                    numOfWins: { increment: augmentNumberOfWins },
                    sumOfPlacements: { increment: augmentSumOfPlacements },
                    numOfAppear: { increment: augmentNumberOfComps }
                }
            });
        }
        else {
            avgPlace = parseFloat((augmentSumOfPlacements / augmentNumberOfComps).toFixed(2));
            winRate = parseFloat(((augmentNumberOfWins / augmentNumberOfComps) * 100).toFixed(2));
            playRate = parseFloat(((augmentNumberOfComps / numberOfMatchingComps) * 100).toFixed(2));
            await prisma.compsAugments.create({
                data: {
                    compId: compId,
                    augmentId: augmentData,
                    numOfWins: augmentNumberOfWins,
                    numOfAppear: augmentNumberOfComps,
                    sumOfPlacements: augmentSumOfPlacements
                }
            });
        }
        const augment = new Augment(src, name, avgPlace, winRate, playRate);
        augments.push(augment);
    }
    augments.sort((a, b) => {
        if (a.frequency > 1 && b.frequency < 1) {
            return -1;
        }
        else if (a.frequency < 1 && b.frequency > 1) {
            return 1;
        }
        else {
            if (a.avgPlacement < b.avgPlacement) {
                return -1;
            }
            else if (a.avgPlacement > b.avgPlacement) {
                return 1;
            }
            else {
                if (a.winrate > b.winrate) {
                    return -1;
                }
                else if (a.winrate < b.winrate) {
                    return 1;
                }
            }
        }
        return 0;
    });
    composition.augments = augments;
}
