import { Comp } from 'types/classes';

const collectDataAboutItemsCMS = (
  itemsData: Object,
  compositionUnits: Object,
  compositionInput: Comp
) => {
  for (const unit of compositionInput.units) {
    if (!itemsData.hasOwnProperty(unit.id)) {
      itemsData[unit.id] = {};
    }
    if (compositionUnits.hasOwnProperty(unit.id)) {
      for (const item of compositionUnits[unit['id']]['items']) {
        const unitItems = itemsData[unit['id']];
        if (unitItems.hasOwnProperty(item)) {
          unitItems[item]['numberOfComps'] += 1;
        } else {
          unitItems[item] = {};
          unitItems[item]['numberOfComps'] = 1;
        }
      }
    }
  }
};

export default collectDataAboutItemsCMS;
