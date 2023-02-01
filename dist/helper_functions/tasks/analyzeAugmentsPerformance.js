const analyzeAugmentsPerformance = (augmentsObject, firstChoiceAugmentObject, secondChoiceAugmentObject, thirdChoiceAugmentObject, composition) => {
    for (let i = 0; i < composition.augments.length; i++) {
        let augment = composition.augments[i];
        augment = augment.replace('HR', '');
        switch (i) {
            case 0:
                if (firstChoiceAugmentObject.hasOwnProperty(augment)) {
                    firstChoiceAugmentObject[augment].sumOfPlacements +=
                        composition.placement;
                    firstChoiceAugmentObject[augment].numberOfComps += 1;
                    if (composition.placement == 1) {
                        firstChoiceAugmentObject[augment].numberOfWins += 1;
                    }
                }
                else {
                    firstChoiceAugmentObject[augment] = {
                        sumOfPlacements: composition.placement,
                        numberOfComps: 1,
                        numberOfWins: 0
                    };
                    if (composition.placement == 1) {
                        firstChoiceAugmentObject[augment].numberOfWins++;
                    }
                }
                break;
            case 1:
                if (secondChoiceAugmentObject.hasOwnProperty(augment)) {
                    secondChoiceAugmentObject[augment].sumOfPlacements +=
                        composition.placement;
                    secondChoiceAugmentObject[augment].numberOfComps += 1;
                    if (composition.placement == 1) {
                        secondChoiceAugmentObject[augment].numberOfWins += 1;
                    }
                }
                else {
                    secondChoiceAugmentObject[augment] = {
                        sumOfPlacements: composition.placement,
                        numberOfComps: 1,
                        numberOfWins: 0
                    };
                    if (composition.placement == 1) {
                        secondChoiceAugmentObject[augment].numberOfWins++;
                    }
                }
                break;
            case 2:
                if (thirdChoiceAugmentObject.hasOwnProperty(augment)) {
                    thirdChoiceAugmentObject[augment].sumOfPlacements +=
                        composition.placement;
                    thirdChoiceAugmentObject[augment].numberOfComps += 1;
                    if (composition.placement == 1) {
                        thirdChoiceAugmentObject[augment].numberOfWins += 1;
                    }
                }
                else {
                    thirdChoiceAugmentObject[augment] = {
                        sumOfPlacements: composition.placement,
                        numberOfComps: 1,
                        numberOfWins: 0
                    };
                    if (composition.placement == 1) {
                        thirdChoiceAugmentObject[augment].numberOfWins++;
                    }
                }
                break;
        }
        if (augmentsObject.hasOwnProperty(augment)) {
            augmentsObject[augment].sumOfPlacements += composition.placement;
            augmentsObject[augment].numberOfComps += 1;
            if (composition.placement == 1) {
                augmentsObject[augment].numberOfWins += 1;
            }
        }
        else {
            augmentsObject[augment] = {
                sumOfPlacements: composition.placement,
                numberOfComps: 1,
                numberOfWins: 0
            };
            if (composition.placement == 1) {
                augmentsObject[augment].numberOfWins++;
            }
        }
    }
};
export default analyzeAugmentsPerformance;
