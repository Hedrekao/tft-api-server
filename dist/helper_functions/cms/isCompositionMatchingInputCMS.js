const isCompositionMatchingInputCMS = (input, compositionUnits) => {
    let isCompositionMatchingInput = true;
    for (const unit of input.units) {
        if (unit.isCore) {
            const unitIndex = Object.keys(compositionUnits).indexOf(unit.id);
            if (unitIndex == -1) {
                isCompositionMatchingInput = false;
                break;
            }
            else {
                if (unit.level != 0 && compositionUnits[unit.id].level != unit.level) {
                    isCompositionMatchingInput = false;
                    break;
                }
            }
        }
    }
    return isCompositionMatchingInput;
};
export default isCompositionMatchingInputCMS;
