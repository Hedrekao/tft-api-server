import { PrismaClient } from '@prisma/client';
import { getDataDragonUnitInfo } from '../getDataDragonUnitInfo.js';
const prisma = new PrismaClient();
const calculateAndSaveUnitsDataIntoDb = async (unitsObject, dataDragon) => {
    const set8DataChampions = dataDragon?.sets[8].champions;
    const set8DataTraits = dataDragon?.sets[8].traits;
    if (set8DataChampions == undefined || set8DataTraits == undefined)
        return;
    for (const id in unitsObject) {
        try {
            const numOfRecords = await prisma.champions_ranking.count({
                where: { id: id }
            });
            if (numOfRecords == 1) {
                await prisma.champions_ranking.update({
                    where: { id: id },
                    data: {
                        sumOfPlacements: {
                            increment: unitsObject[id].sumOfPlacements
                        },
                        sumOfWins: { increment: unitsObject[id].numberOfWins },
                        numberOfAppearances: {
                            increment: unitsObject[id].numberOfComps
                        }
                    }
                });
            }
            else {
                const unitInfo = getDataDragonUnitInfo(set8DataChampions, id);
                const dataDragonUnit = set8DataChampions[id];
                let url = 'Error';
                let name = 'Error';
                if (unitInfo != undefined) {
                    url = unitInfo.url;
                    name = unitInfo.name;
                }
                const traits = [];
                for (const traitName of dataDragonUnit.traits) {
                    let traitFromDb = await prisma.traits.findFirst({
                        where: { name: traitName }
                    });
                    if (traitFromDb == null) {
                        const traitFromDataDragon = set8DataTraits?.find((traitData) => traitData.name == traitName);
                        const traitIconWithWrongExt = traitFromDataDragon?.icon.toLowerCase();
                        const icon = traitIconWithWrongExt
                            ?.substring(0, traitIconWithWrongExt.length - 3)
                            .concat('png');
                        if (traitFromDataDragon == undefined)
                            continue;
                        traitFromDb = await prisma.traits.create({
                            data: {
                                id: traitFromDataDragon.apiName,
                                name: traitName,
                                icon: `https://raw.communitydragon.org/latest/game/${icon}`
                            }
                        });
                    }
                    traits.push(traitFromDb);
                }
                await prisma.champions_ranking.create({
                    data: {
                        id: id,
                        name: name,
                        icon: url,
                        sumOfPlacements: unitsObject[id].sumOfPlacements,
                        numberOfAppearances: unitsObject[id].numberOfComps,
                        sumOfWins: unitsObject[id].numberOfWins,
                        traits: {
                            connect: traits.map((trait) => {
                                return { id: trait.id };
                            })
                        }
                    }
                });
            }
        }
        catch (error) {
            console.log(error.message);
        }
    }
};
export default calculateAndSaveUnitsDataIntoDb;
