import { cache } from '../singletonCache.js';

const mapItems = (names: Array<string>, ids: Array<number>) => {
  const dataDragon: DataDragon | undefined = cache.get('dataDragon');
  const set8Data = dataDragon?.items;
  const result = [];

  for (let i = 0; i < names.length; i++) {
    const dataDragonItem = set8Data?.find((v) => v.id == ids[i]);
    const iconWithWrongExt = dataDragonItem?.icon.toLowerCase();
    const icon = iconWithWrongExt
      ?.substring(0, iconWithWrongExt.length - 3)
      .concat('png');
    result.push({
      id: ids[i],
      apiName: names[i],
      name: dataDragonItem?.name,
      icon: `https://raw.communitydragon.org/latest/game/${icon}`
    });
  }
  return result;
};

export default mapItems;
