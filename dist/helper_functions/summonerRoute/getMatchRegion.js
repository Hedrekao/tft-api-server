const getMatchRegion = (region) => {
    region = region.toLocaleLowerCase();
    switch (region) {
        case 'eun1':
        case 'euw1':
        case 'ru':
        case 'tr1':
            return 'europe';
        case 'jp1':
        case 'kr':
            return 'asia';
        case 'na1':
        case 'br1':
        case 'la1':
        case 'la2':
            return 'americas';
        case 'oce1':
            return 'sea';
    }
};
export default getMatchRegion;
