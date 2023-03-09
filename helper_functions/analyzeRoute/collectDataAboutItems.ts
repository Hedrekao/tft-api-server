import { Item } from 'types/classes';

const collectDataAboutItems = (
  composition: RiotAPIParticipantDto,
  inputData: AnalysisInputData,
  itemsData: ItemsData,
  compositionUnits: TransformedUnits
) => {
  for (const unit of inputData) {
    if (!itemsData.hasOwnProperty(unit.name)) {
      itemsData[unit.name] = {};
    }
    for (const item of compositionUnits[unit.name].itemsNames) {
      const unitItems = itemsData[unit.name];
      if (item === 'TFT_Item_EmptyBag') continue;
      if (unitItems.hasOwnProperty(item)) {
        unitItems[item].sumOfPlacements += composition.placement;
        unitItems[item].numberOfComps += 1;
      } else {
        unitItems[item] = {
          name: item,
          sumOfPlacements: composition.placement,
          numberOfComps: 1
        };
      }
    }
  }
};

export default collectDataAboutItems;
