import { PrismaClient } from '@prisma/client';
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
    if (comp.visibility) {
      const jsonString = comp.json;
      const composition: Comp = JSON.parse(jsonString);
      result.push(composition);
    }
  }
  return result;
};

export default getCompsFromDb;
