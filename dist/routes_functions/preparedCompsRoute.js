import { PrismaClient } from '@prisma/client';
import { Augment, Comp, Item, ItemUnit, Trait, Unit, UnitHex, UnitItems, Variation } from '../types/classes.js';
const prisma = new PrismaClient();
const getCompsFromDb = async () => {
    const result = [];
    const comps = await prisma.composition.findMany();
    for (const comp of comps) {
        const compId = comp.id;
        const augmentsData = await prisma.augments.findMany({
            where: { compid: compId }
        });
        const augmentArray = [];
        for (const augmentData of augmentsData) {
            const augment = new Augment(augmentData.src, augmentData.name, parseFloat(String(augmentData.avgplacement)), parseFloat(String(augmentData.winrate)), parseFloat(String(augmentData.frequency)));
            augmentArray.push(augment);
        }
        const traitsData = await prisma.traits.findMany({
            where: { compid: compId }
        });
        const traitsArray = [];
        for (const traitData of traitsData) {
            const trait = new Trait(traitData.name, traitData.currenttrait, traitData.traitstyle, traitData.url);
            traitsArray.push(trait);
        }
        const unitsData = await prisma.unit.findMany({ where: { compid: compId } });
        const unitsArray = [];
        for (const unitData of unitsData) {
            const itemsData = await prisma.item.findMany({
                where: { unitid: unitData.id }
            });
            const itemsArray = [];
            for (const itemData of itemsData) {
                const item = new Item(itemData.itemId, itemData.name, itemData.url);
                itemsArray.push(item);
            }
            const level = unitData.level;
            const unit = new Unit(unitData.idGiven, unitData.name, unitData.cost, unitData.url, level, itemsArray);
            unitsArray.push(unit);
        }
        let matrixRow = Array(7);
        matrixRow = matrixRow.fill(new UnitHex(null, null, null, null, 0, null), 0, 8);
        const unitHexMatrix = [
            matrixRow,
            matrixRow.slice(),
            matrixRow.slice(),
            matrixRow.slice()
        ];
        const unitHexesData = await prisma.unithex.findMany({
            where: { compid: compId }
        });
        for (const unitHexData of unitHexesData) {
            const itemsData = await prisma.item.findMany({
                where: { unithexid: unitHexData.id }
            });
            const itemsArray = [];
            for (const itemData of itemsData) {
                const item = new Item(itemData.itemId, itemData.name, itemData.url);
                itemsArray.push(item);
            }
            const level = unitHexData.level;
            const unitHex = new UnitHex(unitHexData.idGiven, unitHexData.name, unitHexData.cost, unitHexData.url, level, itemsArray);
            unitHexMatrix[unitHexData.yposition][unitHexData.xposition] = unitHex;
        }
        const unitItemsArray = [];
        const unitItemsData = await prisma.unititems.findMany({
            where: { compid: compId }
        });
        for (const unitItemData of unitItemsData) {
            const itemsBIS = [];
            const itemsRate = [];
            const itemsUnitData = await prisma.itemunit.findMany({
                where: { unititemid: unitItemData.id }
            });
            for (const itemUnitData of itemsUnitData) {
                if (itemUnitData.isbis) {
                    const itemUnit = new ItemUnit(itemUnitData.src, itemUnitData.name, null);
                    itemsBIS.push(itemUnit);
                }
                else {
                    const itemUnit = new ItemUnit(itemUnitData.src, itemUnitData.name, parseFloat(String(itemUnitData.rate)));
                    itemsRate.push(itemUnit);
                }
            }
            const unitItems = new UnitItems(unitItemData.unitname, unitItemData.unitsrc, unitItemData.cost, itemsBIS, itemsRate);
            unitItemsArray.push(unitItems);
        }
        const variationsArray = [];
        const variationsData = await prisma.variation.findMany({
            where: { compid: compId }
        });
        for (const variationData of variationsData) {
            const traitsArray = [];
            const traitsData = await prisma.traits.findMany({
                where: { variationid: variationData.id }
            });
            for (const traitData of traitsData) {
                const trait = new Trait(traitData.name, traitData.currenttrait, traitData.traitstyle, traitData.url);
                traitsArray.push(trait);
            }
            const unitsArray = [];
            const unitsData = await prisma.unit.findMany({
                where: { variationid: variationData.id }
            });
            for (const unitData of unitsData) {
                const itemsData = await prisma.item.findMany({
                    where: { unitid: unitData.id }
                });
                const itemsArray = [];
                for (const itemData of itemsData) {
                    const item = new Item(itemData.itemId, itemData.name, itemData.url);
                    itemsArray.push(item);
                }
                const level = unitData.level;
                const unit = new Unit(unitData.idGiven, unitData.name, unitData.cost, unitData.url, level, itemsArray);
                unitsArray.push(unit);
            }
            const variation = new Variation(parseFloat(String(variationData.avgPlacement)), parseFloat(String(variationData.top4Ratio)), unitsArray, traitsArray);
            variationsArray.push(variation);
        }
        const composition = new Comp(unitsArray, traitsArray, parseFloat(String(comp.avgplacement)), parseFloat(String(comp.top4ratio)), parseFloat(String(comp.winrate)), parseFloat(String(comp.playrate)), unitHexMatrix, unitItemsArray, augmentArray, variationsArray);
        result.push(composition);
    }
    return result;
};
export default getCompsFromDb;
