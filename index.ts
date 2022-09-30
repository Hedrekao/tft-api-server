import fastify from 'fastify';
import dotenv from 'dotenv';
import sensible from '@fastify/sensible';
import { PrismaClient } from '@prisma/client';
import cors from '@fastify/cors';
import cron from 'node-cron';
import getSummonersData from './routes_functions/summonerRoute.js';
import analyzeComposition from './routes_functions/analyzeCompRoute.js';
import testAnalyzeRoute from './test_routes_functions/testAnalyzeRoute.js';
import collectDataAboutRankings from './task_functions/collectDataAboutRankings.js';
import getStatsAndAugmentsForCoreUnits from './routes_functions/cmsRoute.js';
import saveCompositionIntoDatabase from './routes_functions/cmsSaveRoute.js';

dotenv.config();

const app = fastify();
app.register(sensible);
app.register(cors);
const port = process.env.PORT || 3001;
const prisma = new PrismaClient();

app.post('/comps', async (req: any, res) => {
  console.log(req.body.inputData);
  return await analyzeComposition(req.body.inputData, 30, 80);
});

app.get('/summoner/:region/:name', async (req: any, res) => {
  return await getSummonersData(req.params.name, req.params.region);
});

app.get('/units', async (req, res) => {
  return await commitToDb(prisma.champions.findMany());
});

app.post('/cms', async (req: any, res) => {
  console.log(req.body.inputData);
  return await getStatsAndAugmentsForCoreUnits(req.body.inputData, 30, 80);
});

app.post('/cms/save', async (req: any, res) => {
  try {
    console.log(req.body.composition);
    await saveCompositionIntoDatabase(req.body.composition);
    return { info: 'data succesfully saved' };
  } catch (e: any) {
    return { error: e.message };
  }
});

app.get('/units-ranking', async (req, res) => {
  const numberOfCompsQuery = await prisma.general_data.findUnique({
    where: { id: 1 }
  });
  const numberOfComps = numberOfCompsQuery?.totalNumberOfComps;
  const result = await prisma.champions_ranking.findMany();

  const data = result.map((unit) => {
    const object = {
      id: unit.id,
      avg_place: (
        unit.sumOfPlacements /
        (unit.numberOfAppearances != 0 ? unit.numberOfAppearances : 1)
      ).toFixed(2),
      frequency: ((unit.numberOfAppearances / numberOfComps!) * 100).toFixed(2),
      winrate: (
        (unit.sumOfWins /
          (unit.numberOfAppearances != 0 ? unit.numberOfAppearances : 1)) *
        100
      ).toFixed(2)
    };
    return object;
  });
  data.sort((a, b) => {
    if (a['avg_place'] < b['avg_place']) {
      return -1;
    } else if (a['avg_place'] > b['avg_place']) {
      return 1;
    } else {
      if (a['frequency'] > b['frequency']) {
        return -1;
      } else if (a['frequency'] < b['frequency']) {
        return 1;
      }
    }
    return 0;
  });
  return data;
});

app.get('/items-ranking', async (req, res) => {
  const numberOfCompsQuery = await prisma.general_data.findUnique({
    where: { id: 1 }
  });
  const numberOfComps = numberOfCompsQuery?.totalNumberOfComps;
  let result = await prisma.items_ranking.findMany();

  result = result.filter((item) => {
    return item.id != 88 && item.id != 10006 && item.id > 10;
  });

  const data = result.map((item) => {
    const object = {
      id: item.id,
      avg_place: (
        item.sumOfPlacements /
        (item.numberOfAppearances != 0 ? item.numberOfAppearances : 1)
      ).toFixed(2),
      frequency: ((item.numberOfAppearances / numberOfComps!) * 100).toFixed(2),
      winrate: (
        (item.sumOfWins /
          (item.numberOfAppearances != 0 ? item.numberOfAppearances : 1)) *
        100
      ).toFixed(2)
    };
    return object;
  });
  data.sort((a, b) => {
    if (a['avg_place'] < b['avg_place']) {
      return -1;
    } else if (a['avg_place'] > b['avg_place']) {
      return 1;
    } else {
      if (a['frequency'] > b['frequency']) {
        return -1;
      } else if (a['frequency'] < b['frequency']) {
        return 1;
      }
    }
    return 0;
  });
  return data;
});

app.get('/augments-ranking', async (req, res) => {
  const numberOfCompsQuery = await prisma.general_data.findUnique({
    where: { id: 1 }
  });
  const numberOfComps = numberOfCompsQuery?.totalNumberOfComps;
  const result = await prisma.augments_ranking.findMany();

  const data = result.map((augment) => {
    const object = {
      id: augment.id,
      avg_place: (
        augment.sumOfPlacements /
        (augment.numberOfAppearances != 0 ? augment.numberOfAppearances : 1)
      ).toFixed(2),
      frequency: ((augment.numberOfAppearances / numberOfComps!) * 100).toFixed(
        2
      ),
      winrate: (
        (augment.sumOfWins /
          (augment.numberOfAppearances != 0
            ? augment.numberOfAppearances
            : 1)) *
        100
      ).toFixed(2)
    };
    return object;
  });

  data.sort((a, b) => {
    if (a['avg_place'] < b['avg_place']) {
      return -1;
    } else if (a['avg_place'] > b['avg_place']) {
      return 1;
    } else {
      if (a['frequency'] > b['frequency']) {
        return -1;
      } else if (a['frequency'] < b['frequency']) {
        return 1;
      }
    }
    return 0;
  });
  return data;
});

app.get('/test', async (req: any, res) => {
  collectDataAboutRankings(70);
});

app.get('/unit/:id', async (req: any, res) => {
  return await commitToDb(
    prisma.champions.findUnique({
      where: {
        id: req.params.id
      }
    })
  );
});

app.listen({ port: port, host: '0.0.0.0' }, (err) => {
  console.log('Server is running');
});

async function commitToDb(promise: Promise<any>) {
  const [error, data] = await app.to(promise);

  if (error) return app.httpErrors.internalServerError(error.message);
  return data;
}

cron.schedule('0 */12 * * *', () => {
  collectDataAboutRankings(70);
});
