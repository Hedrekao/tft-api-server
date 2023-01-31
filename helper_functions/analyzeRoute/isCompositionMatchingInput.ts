const isCompositionMatchingInput = (
  inputData: AnalysisInputData,
  compositionUnits: TransformedUnits
): boolean => {
  let isCompositionMatchingInput = true;
  for (const unit of inputData) {
    const unitIndex = Object.keys(compositionUnits).indexOf(unit.name);
    if (unitIndex == -1) {
      isCompositionMatchingInput = false;
      break;
    } else {
      if (unit.level != 0 && compositionUnits[unit.name].level != unit.level) {
        isCompositionMatchingInput = false;
        break;
      }
      const providedItems = unit.items;
      if (providedItems.length == 0) {
        continue;
      }
      const items = providedItems?.map((item) => {
        return item.id;
      });

      if (
        items.length != 0 &&
        !items.every((item) => {
          return compositionUnits[unit.name].items.indexOf(item) != -1;
        })
      ) {
        isCompositionMatchingInput = false;
        break;
      }
    }
  }
  return isCompositionMatchingInput;
};
export default isCompositionMatchingInput;
