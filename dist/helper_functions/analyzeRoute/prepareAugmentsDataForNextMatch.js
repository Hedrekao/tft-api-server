const prepareAugmentsDataForNextMatch = (augmentsData) => {
    for (const augmentData in augmentsData) {
        augmentsData[augmentData]['firstAppearanceOfMatch'] = true;
    }
};
export default prepareAugmentsDataForNextMatch;
