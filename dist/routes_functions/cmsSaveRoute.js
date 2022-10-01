import { PrismaClient } from '@prisma/client';
import find4MostFrequentItemsOnCoreUnits from '../helper_functions/cms/find4MostFrequentItemsOnCoreUnits.js';
const prisma = new PrismaClient();
const saveCompositionIntoDatabase = async (composition) => {
    await find4MostFrequentItemsOnCoreUnits(composition);
    const compData = await prisma.composition.create({
        data: {
            avgplacement: composition.avgPlacement,
            top4ratio: composition.top4Ratio,
            playrate: composition.playrate,
            winrate: composition.winrate
        }
    });
    for (const augment of composition.augments) {
        await prisma.augments.create({
            data: {
                src: augment.src,
                name: augment.name,
                avgplacement: augment.avgPlacement,
                winrate: augment.winrate,
                frequency: augment.frequency,
                compid: compData.id
            }
        });
    }
    for (const trait of composition.traits) {
        await prisma.traits.create({
            data: {
                name: trait.name,
                currenttrait: trait.currentTrait,
                traitstyle: trait.traitStyle,
                url: trait.url,
                compid: compData.id
            }
        });
    }
    for (const unit of composition.units) {
        const unitData = await prisma.unit.create({
            data: {
                idGiven: unit.id,
                name: unit.name,
                url: unit.url,
                cost: unit.cost,
                level: unit.level,
                compid: compData.id
            }
        });
        if (unit.items != null) {
            for (const item of unit.items) {
                await prisma.item.create({
                    data: {
                        itemId: item.id,
                        name: item.name,
                        url: item.url,
                        unitid: unitData.id
                    }
                });
            }
        }
    }
    for (const variation of composition.variations) {
        const variationData = await prisma.variation.create({
            data: {
                avgPlacement: variation.avgPlacement,
                top4Ratio: variation.top4ratio,
                compid: compData.id
            }
        });
        for (const trait of variation.traits) {
            await prisma.traits.create({
                data: {
                    name: trait.name,
                    currenttrait: trait.currentTrait,
                    traitstyle: trait.traitStyle,
                    url: trait.url,
                    variationid: variationData.id
                }
            });
        }
        for (const unit of variation.units) {
            const unitData = await prisma.unit.create({
                data: {
                    idGiven: unit.id,
                    name: unit.name,
                    url: unit.url,
                    cost: unit.cost,
                    level: unit.level,
                    variationid: variationData.id
                }
            });
            if (unit.items != null) {
                for (const item of unit.items) {
                    await prisma.item.create({
                        data: {
                            itemId: item.id,
                            name: item.name,
                            url: item.url,
                            unitid: unitData.id
                        }
                    });
                }
            }
        }
    }
    for (const unitItems of composition.items) {
        const unitItemData = await prisma.unititems.create({
            data: {
                unitname: unitItems.unitName,
                unitsrc: unitItems.unitSrc,
                cost: unitItems.cost,
                compid: compData.id
            }
        });
        for (const bisItem of unitItems.itemsBIS) {
            await prisma.itemunit.create({
                data: {
                    src: bisItem.src,
                    name: bisItem.name,
                    rate: bisItem.rate,
                    isbis: true,
                    unititemid: unitItemData.id
                }
            });
        }
        for (const itemRate of unitItems.itemsRate) {
            await prisma.itemunit.create({
                data: {
                    src: itemRate.src,
                    name: itemRate.name,
                    rate: itemRate.rate,
                    isbis: false,
                    unititemid: unitItemData.id
                }
            });
        }
    }
    for (let i = 0; i < composition.positioning.length; i++) {
        const row = composition.positioning[i];
        for (let j = 0; j < row.length; j++) {
            const unithex = row[j];
            if (unithex.id != null) {
                const unitHexData = await prisma.unithex.create({
                    data: {
                        idGiven: unithex.id,
                        name: unithex.name,
                        cost: unithex.cost,
                        url: unithex.url,
                        xposition: j,
                        yposition: i,
                        level: unithex.level,
                        compid: compData.id
                    }
                });
                if (unithex.items != null) {
                    for (const item of unithex.items) {
                        await prisma.item.create({
                            data: {
                                itemId: item.id,
                                name: item.name,
                                url: item.url,
                                unithexid: unitHexData.id
                            }
                        });
                    }
                }
            }
        }
    }
};
export default saveCompositionIntoDatabase;
