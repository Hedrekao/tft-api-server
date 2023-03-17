import { Variation } from '../../types/classes.js';

export function analyzeVariationPerformanceTask(
  variation: Variation,
  variationPerformance: {
    placementOverall: number;
    top4Count: number;
    numberOfComps: number;
  }
) {
  variation.avgPlacement = parseFloat(
    (
      (variationPerformance.placementOverall /
        variationPerformance.numberOfComps +
        variation.avgPlacement) /
      2
    ).toFixed(2)
  );
  variation.top4ratio = parseFloat(
    (
      ((variationPerformance.top4Count / variationPerformance.numberOfComps) *
        100 +
        variation.top4ratio) /
      2
    ).toFixed(2)
  );
}
