import fastify from 'fastify';
import dotenv from 'dotenv';
import sensible from '@fastify/sensible';
import { PrismaClient } from '@prisma/client';
import cors from '@fastify/cors';
import getSummonersData from './routes_functions/summonerRoute.js';
dotenv.config();
const app = fastify();
app.register(sensible);
app.register(cors);
const prisma = new PrismaClient();
app.get('/comps', async (req, res) => {
    // return findMatchingComposition('baginski');
});
app.get('/summoner/:region/:name', async (req, res) => {
    return getSummonersData(req.params.name, req.params.region);
});
app.listen({ port: process.env.PORT }, (err) => {
    console.log('Server is running');
});
async function commitToDb(promise) {
    const [error, data] = await app.to(promise);
    if (error)
        return app.httpErrors.internalServerError(error.message);
    return data;
}
