import fastify from 'fastify';
import dotenv from 'dotenv';
import sensible from '@fastify/sensible';
import { PrismaClient } from '@prisma/client';
import cors from '@fastify/cors';
import getSummonersData from './routes_functions/summonerRoute.js';
import analyzeComposition from './routes_functions/analyzeCompRoute.js';
import testAnalyzeRoute from './test_routes_functions/testAnalyzeRoute.js';

dotenv.config();

const app = fastify();
app.register(sensible);
app.register(cors);
const port = process.env.PORT || 3001;
const prisma = new PrismaClient();

app.post('/comps', async (req: any, res) => {
  return await analyzeComposition(req.body.inputData, 30, 80);
});

app.get('/summoner/:region/:name', async (req: any, res) => {
  return await getSummonersData(req.params.name, req.params.region);
});

app.get('/units', async (req, res) => {
  return await commitToDb(prisma.champions.findMany());
});

app.post('/test', async (req: any, res) => {
  return await testAnalyzeRoute(req.body.input, 20, 40);
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
