const collectDataAboutAugments = (composition, augmentsData) => {
    for (const augment of composition.augments) {
        if (augmentsData.hasOwnProperty(augment)) {
            augmentsData[augment].sumOfPlacements += composition.placement;
            augmentsData[augment].numberOfComps += 1;
            if (composition.placement == 1) {
                augmentsData[augment].numberOfWins += 1;
            }
        }
        else {
            augmentsData[augment] = {
                numberOfComps: 1,
                numberOfWins: 0,
                sumOfPlacements: composition.placement
            };
            if (composition.placement == 1) {
                augmentsData[augment].numberOfWins = 1;
            }
        }
    }
};
export default collectDataAboutAugments;
