const collectDataAboutVariation = (composition, variationPerformance) => {
    console.log(variationPerformance);
    variationPerformance['placementOverall'] += composition['placement'];
    if (composition['placement'] <= 4) {
        variationPerformance['top4Count']++;
    }
    variationPerformance['numberOfComps']++;
};
export default collectDataAboutVariation;
