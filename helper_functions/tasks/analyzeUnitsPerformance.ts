const analyzeUnitsPerformance = (
  unitsObject: Object,
  composition: Array<Object>
) => {
  for (const unit of composition['units']) {
    const id = unit['character_id'];
    if (unitsObject.hasOwnProperty(id)) {
      unitsObject[id]['sumOfPlacement'] += composition['placement'];
      unitsObject[id]['frequency'] += 1;
      if (composition['placement'] == 1) {
        unitsObject[id]['winrate'] += 1;
      }
    } else {
      unitsObject[id] = {};
      unitsObject[id]['sumOfPlacement'] = composition['placement'];
      unitsObject[id]['frequency'] = 1;
      if (composition['placement'] == 1) {
        unitsObject[id]['winrate'] = 1;
      } else {
        unitsObject[id]['winrate'] = 0;
      }
    }
  }
};

export default analyzeUnitsPerformance;
