import { PrismaClient } from '@prisma/client';
import { Comp, ItemUnit, UnitItems } from '../../types/classes.js';

export async function reanalyzeItemsPerformance(
  compId: bigint,
  compositionInput: Comp,
  itemsData: ItemsDataCMS,
  dataDragon: DataDragon | undefined,
  prisma: PrismaClient
) {
  const set8Data = dataDragon?.items;

  const unitItemsArr = [];
  const currentUnits = await prisma.compsUnits.findMany({
    where: { compId: compId },
    include: { items: true }
  });
  for (const unit of compositionInput.units) {
    let itemRates: Array<ItemUnit> = [];
    const unitAppearance = itemsData[unit.id].numberOfAppearances;
    const currentUnit = currentUnits.find((u) => u.unitId === unit.id);
    if (!currentUnit) {
      await prisma.compsUnits.create({
        data: {
          compId: compId,
          unitId: unit.id,
          numOfAppear: unitAppearance
        }
      });
    } else {
      await prisma.compsUnits.update({
        where: { compId_unitId: { compId: compId, unitId: unit.id } },
        data: {
          numOfAppear: { increment: unitAppearance }
        }
      });
    }
    for (const item in itemsData[unit.id]) {
      if (item != 'numberOfAppearances') {
        let rate;
        const itemAppearances = itemsData[unit.id][item].numberOfComps;
        const dataDragonItem = set8Data![item];
        const iconWithWrongExt = dataDragonItem?.icon.toLowerCase();
        const icon = iconWithWrongExt
          ?.substring(0, iconWithWrongExt.length - 3)
          .concat('png');
        if (currentUnit) {
          const currentItem = currentUnit.items.find((i) => i.itemId === item);
          if (currentItem) {
            rate = (
              ((itemAppearances + currentItem.numOfAppear) /
                (unitAppearance + currentUnit.numOfAppear)) *
              100
            ).toFixed(1);

            await prisma.compsItems.update({
              where: {
                compId_itemId_unitId: { compId, itemId: item, unitId: unit.id }
              },
              data: {
                numOfAppear: {
                  increment: itemAppearances
                }
              }
            });
          } else {
            rate = (
              (itemAppearances / (unitAppearance + currentUnit.numOfAppear)) *
              100
            ).toFixed(1);
            await prisma.compsItems.create({
              data: {
                compId: compId,
                unitId: unit.id,
                itemId: item,
                numOfAppear: itemAppearances
              }
            });
          }
        } else {
          rate = ((itemAppearances / unitAppearance) * 100).toFixed(1);

          await prisma.compsItems.create({
            data: {
              compId: compId,
              unitId: unit.id,
              itemId: item,
              numOfAppear: itemAppearances
            }
          });
        }
        const itemUnit = new ItemUnit(
          `https://raw.communitydragon.org/latest/game/${icon}`,
          dataDragonItem.name,
          parseFloat(rate)
        );
        itemRates.push(itemUnit);
      }
    }
    itemRates.sort((a, b) => {
      if (a.rate! > b.rate!) {
        return -1;
      }
      if (a.rate! < b.rate!) {
        return 1;
      }
      return 0;
    });

    itemRates = itemRates.slice(0, 6);

    let itemsBIS: Array<ItemUnit> = [];
    if (unit.items != null && unit.items.length > 0) {
      for (const item of unit.items) {
        const itemUnit = new ItemUnit(item.url, item.name, null);
        itemsBIS.push(itemUnit);
      }
    } else {
      for (let i = 0; i < 3; i++) {
        const itemRate = itemRates[i];
        const itemUnit = new ItemUnit(itemRate.src, itemRate.name, null);
        itemsBIS.push(itemUnit);
      }
    }

    const unitItems = new UnitItems(
      unit.id,
      unit.url,
      unit.cost,
      itemsBIS,
      itemRates
    );
    unitItemsArr.push(unitItems);
  }
  compositionInput.items = unitItemsArr;
}
