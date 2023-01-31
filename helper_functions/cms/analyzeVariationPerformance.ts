import { Variation } from '../../types/classes.js';

const analyzeVariationPerformance = (
  variation: Variation,
  variationPerformance: {
    placementOverall: number;
    top4Count: number;
    numberOfComps: number;
  }
) => {
  variation.avgPlacement = parseFloat(
    (
      variationPerformance.placementOverall / variationPerformance.numberOfComps
    ).toFixed(2)
  );
  variation.top4ratio = parseFloat(
    (
      (variationPerformance.top4Count / variationPerformance.numberOfComps) *
      100
    ).toFixed(2)
  );
};

export default analyzeVariationPerformance;
