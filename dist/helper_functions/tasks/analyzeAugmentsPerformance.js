const analyzeAugmentsPerformance = (augmentsObject, composition) => {
    for (const augment of composition['augments']) {
        if (augmentsObject.hasOwnProperty(augment)) {
            augmentsObject[augment]['sumOfPlacement'] += composition['placement'];
            augmentsObject[augment]['frequency'] += 1;
            if (composition['placement'] == 1) {
                augmentsObject[augment]['winrate'] += 1;
            }
        }
        else {
            augmentsObject[augment] = {};
            augmentsObject[augment]['sumOfPlacement'] = composition['placement'];
            augmentsObject[augment]['frequency'] = 1;
            if (composition['placement'] == 1) {
                augmentsObject[augment]['winrate'] = 1;
            }
            else {
                augmentsObject[augment]['winrate'] = 0;
            }
        }
    }
};
export default analyzeAugmentsPerformance;
