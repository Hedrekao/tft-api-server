const analyzeUnitsPerformance = (unitsObject, composition) => {
    for (const unit of composition.units) {
        const id = unit.character_id;
        if (unitsObject.hasOwnProperty(id)) {
            unitsObject[id].sumOfPlacements += composition.placement;
            unitsObject[id].numberOfComps += 1;
            if (composition.placement == 1) {
                unitsObject[id].numberOfWins += 1;
            }
        }
        else {
            unitsObject[id] = {
                sumOfPlacements: composition.placement,
                numberOfComps: 1,
                numberOfWins: 0
            };
            if (composition.placement == 1) {
                unitsObject[id].numberOfWins++;
            }
        }
    }
};
export default analyzeUnitsPerformance;
