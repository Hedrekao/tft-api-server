export function analyzeVariationPerformanceTask(variation, variationPerformance) {
    variation.avgPlacement = parseFloat(((variationPerformance.placementOverall /
        variationPerformance.numberOfComps +
        variation.avgPlacement) /
        2).toFixed(2));
    variation.top4ratio = parseFloat((((variationPerformance.top4Count / variationPerformance.numberOfComps) *
        100 +
        variation.top4ratio) /
        2).toFixed(2));
}
