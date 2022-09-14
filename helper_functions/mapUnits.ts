import getCostOfUnit from './getCostOfUnit.js';
import mapItems from './mapItems.js';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const mapUnits = async (rawUnits: Array<Object>) => {
  const units = await Promise.all(
    rawUnits.map(async (unit) => {
      try {
        await prisma.champions.create({
          data: {
            id: unit['character_id'],
            cost: getCostOfUnit(unit['rarity'])
          }
        });
      } catch (e) {
        console.log('Character already in db');
      }
      const result = {
        id: unit['character_id'],
        level: unit['tier'],
        cost: getCostOfUnit(unit['rarity']),
        items: mapItems(unit['itemNames'], unit['items'])
      };
      return result;
    })
  );

  units.sort((a, b) => {
    if (a['level'] > b['level']) {
      return -1;
    } else if (a['level'] < b['level']) {
      return 1;
    } else {
      if (a['items'].length > b['items'].length) {
        return -1;
      } else if (a['items'].length < b['items'].length) {
        return 1;
      }
    }

    return 0;
  });

  return units;
};

export default mapUnits;
