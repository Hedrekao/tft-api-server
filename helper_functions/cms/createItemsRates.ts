import { PrismaClient } from '@prisma/client';
import { getDataDragonItemInfo } from '../getDataDragonItemInfo.js';
import { Comp, ItemUnit, UnitItems } from '../../types/classes.js';

const prisma = new PrismaClient();
const createItemsRates = async (
  compositionInput: Comp,
  itemsData: ItemsDataCMS,
  dataDragon: DataDragon | undefined
) => {
  const set8Data = dataDragon?.items;

  if (set8Data == undefined) return;

  const unitItemsArr = [];
  for (const unit of compositionInput.units) {
    let itemRates: Array<ItemUnit> = [];

    for (const item in itemsData[unit.id]) {
      if (item != 'numberOfAppearances') {
        const rate = (
          (itemsData[unit.id][item].numberOfComps /
            itemsData[unit.id].numberOfAppearances) *
          100
        ).toFixed(1);
        if (set8Data == undefined) {
          break;
        }
        const { name, src } = getDataDragonItemInfo(set8Data, item);

        const itemUnit = new ItemUnit(src, name, parseFloat(rate));
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
};

export default createItemsRates;
