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

app.get('/units-ranking', async (req, res) => {
  const data = await prisma.champions_ranking.findMany();
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
  const data = await prisma.items_ranking.findMany();
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
  const data = await prisma.augments_ranking.findMany();
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
