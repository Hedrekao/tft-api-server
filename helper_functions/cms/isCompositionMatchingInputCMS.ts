import { Comp, Variation } from '../../types/classes.js';

const isCompositionMatchingInputCMS = (
  input: Comp | Variation,
  compositionUnits: Object
): boolean => {
  let isCompositionMatchingInput = true;
  if (input instanceof Comp) {
    for (const unit of input.units) {
      if (unit.isCore) {
        const unitIndex = Object.keys(compositionUnits).indexOf(unit.name);
        if (unitIndex == -1) {
          isCompositionMatchingInput = false;
          break;
        } else {
          if (
            unit.level != 0 &&
            compositionUnits[unit.name]['level'] != unit.level
          ) {
            isCompositionMatchingInput = false;
            break;
          }
          const providedItems = unit['items'];
          const items = providedItems?.map((item) => {
            return item.id;
          });

          if (
            items?.length != 0 &&
            !items?.every((item) => {
              return (
                compositionUnits[unit['name']]['items'].indexOf(item) != -1
              );
            })
          ) {
            isCompositionMatchingInput = false;
            break;
          }
        }
      }
    }
  } else {
    for (const unit of input.units) {
      const unitIndex = Object.keys(compositionUnits).indexOf(unit.name);
      if (unitIndex == -1) {
        isCompositionMatchingInput = false;
        break;
      } else {
        if (
          unit.level != 0 &&
          compositionUnits[unit.name]['level'] != unit.level
        ) {
          isCompositionMatchingInput = false;
          break;
        }
        const providedItems = unit['items'];
        const items = providedItems?.map((item) => {
          return item.id;
        });

        if (
          items?.length != 0 &&
          !items?.every((item) => {
            return compositionUnits[unit['name']]['items'].indexOf(item) != -1;
          })
        ) {
          isCompositionMatchingInput = false;
          break;
        }
      }
    }
  }

  return isCompositionMatchingInput;
};

export default isCompositionMatchingInputCMS;
