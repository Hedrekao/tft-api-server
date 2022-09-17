import { stringify } from 'querystring';

const isCompositionMatchingInput = (
  inputData: Array<Object>,
  compositionUnits: Object
): boolean => {
  let isCompositionMatchingInput = true;
  for (const unit of inputData) {
    const unitIndex = Object.keys(compositionUnits).indexOf(
      unit['character_id']
    );
    if (unitIndex == -1) {
      isCompositionMatchingInput = false;
      break;
    } else {
      if (
        unit['level'] != 0 &&
        compositionUnits[unit['character_id']]['level'] != unit['level']
      ) {
        isCompositionMatchingInput = false;
        break;
      }
      const providedItems: Array<Object> = unit['item'];
      const items: Array<number> = providedItems.map((item) => {
        return item['id'];
      });
      if (
        !items.every((item) => {
          return compositionUnits[unit['character_id']]['items'].indexOf(item);
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
