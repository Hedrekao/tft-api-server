import { cache } from '../singletonCache.js';

const mapTraits = (rawTraits: Array<Object>) => {
  const dataDragon: DataDragon | undefined = cache.get('dataDragon');
  const set8Data: Array<DataDragonTrait> = dataDragon?.sets[8].traits;
  rawTraits = rawTraits.filter((trait) => {
    return trait['style'] != 0;
  });

  const traits = rawTraits.map((trait) => {
    const dataDragonTrait = set8Data.find((v) => v.apiName == trait['name']);
    const iconWithWrongExt = dataDragonTrait?.icon.toLowerCase();
    const icon = iconWithWrongExt
      ?.substring(0, iconWithWrongExt.length - 3)
      .concat('png');
    const result = {
      apiName: trait['name'],
      name: dataDragonTrait?.name,
      icon: `https://raw.communitydragon.org/latest/game/${icon}`,
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
