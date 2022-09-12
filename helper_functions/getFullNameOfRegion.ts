const getFullNameOfRegion = (region: string) => {
  region = region.toLocaleLowerCase();
  switch (region) {
    case 'eun1':
      return 'EU Nordic & East';
    case 'euw1':
      return 'EU West';
    case 'ru':
      return 'Russia';
    case 'tr1':
      return 'Turkey';
    case 'jp1':
      return 'Japan';
    case 'kr':
      return 'South Korea';
    case 'na1':
      return 'North America';
    case 'br1':
      return 'Brazil';
    case 'la1':
      return 'Latin America North';
    case 'la2':
      return 'Latin America South';
    case 'oce1':
      return 'Oceania';
  }
};

export default getFullNameOfRegion;
