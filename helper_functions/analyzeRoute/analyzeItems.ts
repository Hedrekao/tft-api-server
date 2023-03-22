import { getDataDragonItemInfo } from '../getDataDragonItemInfo.js';
import { getDataDragonUnitInfo } from '../getDataDragonUnitInfo.js';

const analyzeItems = (
  inputData: AnalysisInputData,
  itemsData: ItemsData,
  numberOfMatchingComps: number,
  dataDragon: DataDragon | undefined
) => {
  const set8DataItems = dataDragon?.items;
  const set8DataChampions = dataDragon?.sets[8].champions;
  if (set8DataItems == undefined || set8DataChampions == undefined) return;
  for (const unit of inputData) {
    const unitInfo = getDataDragonUnitInfo(set8DataChampions, unit.name);

    let url = 'Error';
    if (unitInfo != undefined) {
      url = unitInfo.url;
    }

    unit.icon = url;
    const items = itemsData[unit.name];
    let analyzedItems = new Array<AnalyzedItem>();
    for (const item in items) {
      const { name, src } = getDataDragonItemInfo(
        set8DataItems,
        items[item].name
      );

      const analyzedItem: AnalyzedItem = {
        id: items[item].name,
        name: name,
        icon: src,
        playRate: (
          (items[item].numberOfComps / numberOfMatchingComps) *
          100
        ).toFixed(2),
        avgPlace: (
          items[item].sumOfPlacements / items[item].numberOfComps
        ).toFixed(2)
      };
      analyzedItems.push(analyzedItem);
    }

    analyzedItems.sort((a, b) => {
      if (parseFloat(a.playRate) > parseFloat(b.playRate)) {
        return -1;
      } else if (parseFloat(a.playRate) < parseFloat(b.playRate)) {
        return 1;
      } else {
        if (parseFloat(a.avgPlace) < parseFloat(b.avgPlace)) {
          return -1;
        } else if (parseFloat(a.avgPlace) > parseFloat(b.avgPlace)) {
          return 1;
        }
      }
      return 0;
    });

    unit.items = analyzedItems;
  }
};

export default analyzeItems;
