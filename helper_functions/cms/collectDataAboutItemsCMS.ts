import { Comp } from '../../types/classes.js';

const collectDataAboutItemsCMS = (
  itemsData: ItemsDataCMS,
  compositionUnits: TransformedUnits,
  compositionInput: Comp
) => {
  for (const unit of compositionInput.units) {
    if (compositionUnits.hasOwnProperty(unit.id)) {
      if (!itemsData.hasOwnProperty(unit.id)) {
        itemsData[unit.id] = { numberOfAppearances: 1 };
      } else {
        itemsData[unit.id].numberOfAppearances += 1;
      }
      for (const item of compositionUnits[unit.id].itemsNames) {
        if (item == 'TFT_Item_EmptyBag') continue;
        const unitItems = itemsData[unit.id];
        if (unitItems.hasOwnProperty(item)) {
          unitItems[item].numberOfComps += 1;
        } else {
          unitItems[item] = { numberOfComps: 1 };
        }
      }
    }
  }
};

export default collectDataAboutItemsCMS;
