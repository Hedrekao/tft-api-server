import { PrismaClient, variation } from '@prisma/client';
import {
  Augment,
  Comp,
  Item,
  ItemUnit,
  Trait,
  Unit,
  UnitHex,
  UnitItems,
  Variation
} from '../types/classes.js';

const prisma = new PrismaClient();

const getCompsFromDb = async () => {
  const result: Array<Comp> = [];
  const comps = await prisma.compositionJSON.findMany();
  for (const comp of comps) {
    const jsonString: any = comp.json;
    const composition: Comp = JSON.parse(jsonString);
    result.push(composition);
  }
  return result;
};

export default getCompsFromDb;
