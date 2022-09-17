const analyzeAugments = (augmentsData, totalNumberOfMatches) => {
    const result = [];
    for (const augmentData in augmentsData) {
        const augment = {};
        augment['avgPlace'] = (augmentData['sumOfPlacements'] / totalNumberOfMatches).toFixed(2);
        augment['winRate'] = ((augmentData['numberOfWins'] / totalNumberOfMatches) *
            100).toFixed(2);
        augment['playRate'] = ((augmentData['numberOfComps'] / totalNumberOfMatches) *
            100).toFixed(2);
        result.push(augment);
    }
    result.sort((a, b) => {
        if (a['avgPlace'] > b['avgPlace']) {
            return -1;
        }
        else if (a['avgPlace'] < b['avgPlace']) {
            return 1;
        }
        else {
            if (a['winRate'] > b['winRate']) {
                return -1;
            }
            else if (a['winRate'] < b['winRate']) {
                return 1;
            }
        }
        return 0;
    });
    return result;
};
export default analyzeAugments;