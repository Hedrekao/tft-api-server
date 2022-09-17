import fastify from 'fastify';
import dotenv from 'dotenv';
import sensible from '@fastify/sensible';
import { PrismaClient } from '@prisma/client';
import cors from '@fastify/cors';
import getSummonersData from './routes_functions/summonerRoute.js';
import analyzeComposition from './routes_functions/analyzeCompRoute.js';

dotenv.config();

const app = fastify();
app.register(sensible);
app.register(cors);
const port = process.env.PORT || 3001;
const prisma = new PrismaClient();

app.get('/comps', async (req: any, res) => {
  return analyzeComposition(req.body.inputData, 10, 20);
});

app.get('/summoner/:region/:name', async (req: any, res) => {
  return getSummonersData(req.params.name, req.params.region);
});

app.listen({ port: port, host: '0.0.0.0' }, (err) => {
  console.log('Server is running');
});

async function commitToDb(promise: Promise<any>) {
  const [error, data] = await app.to(promise);

  if (error) return app.httpErrors.internalServerError(error.message);
  return data;
}
