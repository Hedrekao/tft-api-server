const collectDataAboutVariation = (composition, variationPerformance) => {
    if (variationPerformance == undefined) {
        variationPerformance = {};
        variationPerformance['placementOverall'] = composition['placement'];
        variationPerformance['top4Count'] = 0;
        if (composition['placement'] <= 4) {
            variationPerformance['top4Count']++;
        }
        variationPerformance['numberOfComps'] = 1;
    }
    else {
        variationPerformance['placementOverall'] += composition['placement'];
        if (composition['placement'] <= 4) {
            variationPerformance['top4Count']++;
        }
        variationPerformance['numberOfComps']++;
    }
};
export default collectDataAboutVariation;
