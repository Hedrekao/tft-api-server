import { Comp, Variation } from '../../types/classes.js';
const isCompositionMatchingInputCMS = (input, compositionUnits) => {
    let isCompositionMatchingInput = true;
    if (input instanceof Comp || input instanceof Variation) {
        for (const unit of input.units) {
            if (unit.isCore) {
                const unitIndex = Object.keys(compositionUnits).indexOf(unit.id);
                if (unitIndex == -1) {
                    isCompositionMatchingInput = false;
                    break;
                }
                else {
                    if (unit.level != 0 &&
                        compositionUnits[unit.id]['level'] != unit.level) {
                        isCompositionMatchingInput = false;
                        break;
                    }
                }
            }
        }
    }
    else {
    }
    return isCompositionMatchingInput;
};
export default isCompositionMatchingInputCMS;
