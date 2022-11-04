const collectDataAboutVariation = (
  composition: Array<Object>,
  variationPerformance: Object
) => {
  variationPerformance['placementOverall'] += composition['placement'];
  if (composition['placement'] <= 4) {
    variationPerformance['top4Count']++;
  }

  variationPerformance['numberOfComps']++;
};
export default collectDataAboutVariation;
