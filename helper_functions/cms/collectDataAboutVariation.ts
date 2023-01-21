const collectDataAboutVariation = (
  composition: RiotAPIParticipantDto,
  variationPerformance: {
    placementOverall: number;
    top4Count: number;
    numberOfComps: number;
  }
) => {
  variationPerformance.placementOverall += composition.placement;
  if (composition.placement <= 4) {
    variationPerformance.top4Count++;
  }

  variationPerformance.numberOfComps++;
};
export default collectDataAboutVariation;
