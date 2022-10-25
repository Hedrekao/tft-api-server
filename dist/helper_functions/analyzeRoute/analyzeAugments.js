const analyzeAugments = (augmentsData, numberOfMatchingComps) => {
    const result = [];
    for (const augmentData in augmentsData) {
        const augment = {};
        augment['name'] = augmentData;
        augment['avgPlace'] = (augmentsData[augmentData]['sumOfPlacements'] /
            augmentsData[augmentData]['numberOfComps']).toFixed(2);
        augment['winRate'] = ((augmentsData[augmentData]['numberOfWins'] /
            augmentsData[augmentData]['numberOfComps']) *
            100).toFixed(2);
        augment['playRate'] = ((augmentsData[augmentData]['numberOfComps'] / numberOfMatchingComps) *
            100).toFixed(2);
        result.push(augment);
    }
    result.sort((a, b) => {
        if (parseFloat(a['playRate']) > 1 && parseFloat(b['playRate']) < 1) {
            return -1;
        }
        else if (parseFloat(a['playRate']) < 1 && parseFloat(b['playRate']) > 1) {
            return 1;
        }
        else {
            if (parseFloat(a['avgPlace']) < parseFloat(b['avgPlace'])) {
                return -1;
            }
            else if (parseFloat(a['avgPlace']) > parseFloat(b['avgPlace'])) {
                return 1;
            }
            else {
                if (parseFloat(a['winRate']) > parseFloat(b['winRate'])) {
                    return -1;
                }
                else if (parseFloat(a['winRate']) < parseFloat(b['winRate'])) {
                    return 1;
                }
            }
        }
        return 0;
    });
    return result;
};
export default analyzeAugments;
