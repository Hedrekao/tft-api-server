const mapTraits = (rawTraits) => {
    rawTraits = rawTraits.filter((trait) => {
        return trait['style'] != 0;
    });
    const traits = rawTraits.map((trait) => {
        const result = {
            name: trait['name'],
            currentTrait: trait['num_units'],
            style: trait['style']
        };
        return result;
    });
    traits.sort((a, b) => {
        if (a['style'] > b['style']) {
            return -1;
        }
        if (a['style'] < b['style']) {
            return 1;
        }
        return 0;
    });
    return traits;
};
export default mapTraits;
