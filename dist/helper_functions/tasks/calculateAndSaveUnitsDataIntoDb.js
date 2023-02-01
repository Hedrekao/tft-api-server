import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const calculateAndSaveUnitsDataIntoDb = async (unitsObject, dataDragon) => {
    const set8DataChampions = dataDragon?.sets[8].champions;
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
                const dataDragonUnit = set8DataChampions[id];
                const iconWithWrongExt = dataDragonUnit?.icon.toLowerCase();
                const urlArr = iconWithWrongExt.split('/');
                const elementUrl = urlArr[4];
                const url = `https://raw.communitydragon.org/latest/game/assets/characters/${id.toLowerCase()}/hud/${elementUrl
                    .replace('.dds', '')
                    .toLowerCase()}.png`;
                const name = dataDragonUnit.name;
                await prisma.champions_ranking.create({
                    data: {
                        id: id,
                        name: name,
                        icon: url,
                        sumOfPlacements: unitsObject[id].sumOfPlacements,
                        numberOfAppearances: unitsObject[id].numberOfComps,
                        sumOfWins: unitsObject[id].numberOfWins
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
