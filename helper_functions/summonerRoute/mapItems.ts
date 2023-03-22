import { getDataDragonItemInfo } from '../getDataDragonItemInfo.js';
import { cache } from '../singletonCache.js';

const mapItems = (names: Array<string>, dataDragon: DataDragon) => {
  const set8Data = dataDragon?.items;
  const result = [];

  if (set8Data == undefined) return [];

  for (let i = 0; i < names.length; i++) {
    const cachedItem = cache.get(`item-${names[i]}`);
    if (cachedItem != undefined) {
      result.push(cachedItem);
      continue;
    }
    const { name, src } = getDataDragonItemInfo(set8Data, names[i]);
    const item = {
      apiName: names[i],
      name: name,
      icon: src
    };
    cache.set(`item-${names[i]}`, item);
    result.push(item);
  }

  return result;
};

export default mapItems;
