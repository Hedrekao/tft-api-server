const isCompositionMatchingInput = (
  inputData: Array<Object>,
  compositionUnits: Object
): boolean => {
  let isCompositionMatchingInput = true;
  for (const unit of inputData) {
    console.log(compositionUnits);
    const unitIndex = Object.keys(compositionUnits).indexOf(unit['name']);
    if (unitIndex == -1) {
      isCompositionMatchingInput = false;
      break;
    } else {
      if (
        unit['level'] != 0 &&
        compositionUnits[unit['name']]['level'] != unit['level']
      ) {
        isCompositionMatchingInput = false;
        break;
      }
      const providedItems: Array<Object> = unit['items'];
      const items: Array<number> = providedItems?.map((item) => {
        return item['id'];
      });

      if (
        items.length != 0 &&
        !items.every((item) => {
          return compositionUnits[unit['name']]['items'].indexOf(item) != -1;
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
