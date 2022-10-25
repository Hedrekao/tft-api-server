import fastify from 'fastify';
import dotenv from 'dotenv';
import sensible from '@fastify/sensible';
import fastifyIO from 'fastify-socket.io';
import { PrismaClient } from '@prisma/client';
import cors from '@fastify/cors';
import cron from 'node-cron';
import axios from 'axios';
import getSummonersData from './routes_functions/summonerRoute.js';
import analyzeComposition from './routes_functions/analyzeCompRoute.js';
import collectDataAboutRankings from './task_functions/collectDataAboutRankings.js';
import getStatsAndAugmentsForCoreUnits from './routes_functions/cmsRoute.js';
import saveCompositionIntoDatabase from './routes_functions/cmsSaveRoute.js';
import getCompsFromDb from './routes_functions/preparedCompsRoute.js';
import getLeaderboardData from './routes_functions/leaderboardRoute.js';
dotenv.config();
axios.defaults.headers.common['X-Riot-Token'] = process.env.API_KEY;
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
const sockets = {};
const app = fastify();
app.register(sensible);
app.register(fastifyIO, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
    }
});
app.register(cors, {
    origin: '*'
});
const port = process.env.PORT || 8080;
const prisma = new PrismaClient();
app.post('/comps', async (req, res) => {
    console.log(req.body.inputData);
    const io = app.io;
    console.log(req.body.socketSessionId);
    return await analyzeComposition(req.body.inputData, req.body.socketSessionId, io, sockets, 1000, 650);
});
app.get('/comps/:id', async (req, res) => {
    const composition = await commitToDb(prisma.userCompositionJSON.findUnique({ where: { id: req.params.id } }));
    const analysis = await commitToDb(prisma.analysisJSON.findUnique({ where: { id: req.params.id } }));
    if (analysis == null) {
        return { composition: composition.json, analysis: 'Wait' };
    }
    else {
        return { composition: composition.json, analysis: analysis.json };
    }
});
app.post('/comps/:id', async (req, res) => {
    if (req.body.composition != undefined) {
        await commitToDb(prisma.userCompositionJSON.create({
            data: { id: req.params.id, json: req.body.composition }
        }));
    }
    if (req.body.analysis != undefined) {
        await commitToDb(prisma.analysisJSON.create({
            data: { id: req.params.id, json: req.body.analysis }
        }));
    }
});
app.get('/summoner/:region/:name', async (req, res) => {
    return await getSummonersData(req.params.name, req.params.region);
});
app.get('/leaderboard/:region', (req, res) => {
    return getLeaderboardData(req.params.region, 99);
});
app.get('/units', async (req, res) => {
    return await commitToDb(prisma.champions.findMany());
});
app.post('/cms', async (req, res) => {
    return await getStatsAndAugmentsForCoreUnits(req.body.inputData, 1000, 500);
});
app.get('/preparedComps', (req, res) => {
    try {
        return getCompsFromDb();
    }
    catch (error) {
        return { error: error.message };
    }
});
app.post('/cms/save', async (req, res) => {
    try {
        await saveCompositionIntoDatabase(req.body.composition);
        return { info: 'data succesfully saved' };
    }
    catch (e) {
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
            avg_place: (unit.sumOfPlacements /
                (unit.numberOfAppearances != 0 ? unit.numberOfAppearances : 1)).toFixed(2),
            frequency: ((unit.numberOfAppearances / numberOfComps) * 100).toFixed(2),
            winrate: ((unit.sumOfWins /
                (unit.numberOfAppearances != 0 ? unit.numberOfAppearances : 1)) *
                100).toFixed(2)
        };
        return object;
    });
    data.sort((a, b) => {
        if (a['avg_place'] < b['avg_place']) {
            return -1;
        }
        else if (a['avg_place'] > b['avg_place']) {
            return 1;
        }
        else {
            if (a['frequency'] > b['frequency']) {
                return -1;
            }
            else if (a['frequency'] < b['frequency']) {
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
            avg_place: (item.sumOfPlacements /
                (item.numberOfAppearances != 0 ? item.numberOfAppearances : 1)).toFixed(2),
            frequency: ((item.numberOfAppearances / numberOfComps) * 100).toFixed(2),
            winrate: ((item.sumOfWins /
                (item.numberOfAppearances != 0 ? item.numberOfAppearances : 1)) *
                100).toFixed(2)
        };
        return object;
    });
    data.sort((a, b) => {
        if (a['avg_place'] < b['avg_place']) {
            return -1;
        }
        else if (a['avg_place'] > b['avg_place']) {
            return 1;
        }
        else {
            if (a['frequency'] > b['frequency']) {
                return -1;
            }
            else if (a['frequency'] < b['frequency']) {
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
            avg_place: (augment.sumOfPlacements /
                (augment.numberOfAppearances != 0 ? augment.numberOfAppearances : 1)).toFixed(2),
            frequency: ((augment.numberOfAppearances / numberOfComps) * 100).toFixed(2),
            winrate: ((augment.sumOfWins /
                (augment.numberOfAppearances != 0
                    ? augment.numberOfAppearances
                    : 1)) *
                100).toFixed(2)
        };
        return object;
    });
    data.sort((a, b) => {
        if (a['avg_place'] < b['avg_place']) {
            return -1;
        }
        else if (a['avg_place'] > b['avg_place']) {
            return 1;
        }
        else {
            if (a['frequency'] > b['frequency']) {
                return -1;
            }
            else if (a['frequency'] < b['frequency']) {
                return 1;
            }
        }
        return 0;
    });
    return data;
});
app.get('/augments-ranking/:stage', async (req, res) => {
    const numberOfCompsQuery = await prisma.general_data.findUnique({
        where: { id: 1 }
    });
    const numberOfComps = numberOfCompsQuery?.totalNumberOfComps;
    let result;
    switch (req.params.stage) {
        case '1':
            result = await prisma.augments_first_choice_ranking.findMany();
            break;
        case '2':
            result = await prisma.augments_second_choice_ranking.findMany();
            break;
        case '3':
            result = await prisma.augments_third_choice_ranking.findMany();
            break;
    }
    const data = result?.map((augment) => {
        const object = {
            id: augment.id,
            avg_place: (augment.sumOfPlacements /
                (augment.numberOfAppearances != 0 ? augment.numberOfAppearances : 1)).toFixed(2),
            frequency: ((augment.numberOfAppearances / numberOfComps) * 100).toFixed(2),
            winrate: ((augment.sumOfWins /
                (augment.numberOfAppearances != 0
                    ? augment.numberOfAppearances
                    : 1)) *
                100).toFixed(2)
        };
        return object;
    });
    data?.sort((a, b) => {
        if (a['avg_place'] < b['avg_place']) {
            return -1;
        }
        else if (a['avg_place'] > b['avg_place']) {
            return 1;
        }
        else {
            if (a['frequency'] > b['frequency']) {
                return -1;
            }
            else if (a['frequency'] < b['frequency']) {
                return 1;
            }
        }
        return 0;
    });
    return data;
});
app.get('/test', async (req, res) => {
    await collectDataAboutRankings(1000);
    console.log('done');
});
app.get('/unit/:id', async (req, res) => {
    return await commitToDb(prisma.champions.findUnique({
        where: {
            id: req.params.id
        }
    }));
});
app.ready().then(() => {
    app.io.on('connection', (socket) => {
        socket.on('connectInit', (sessionId) => {
            // The socket ID is stored along with the unique ID generated by the client
            console.log(sessionId);
            sockets[sessionId] = socket.id;
        });
    });
});
app.listen({ port: port, host: '0.0.0.0' }, (err) => {
    console.log('Server is running');
});
async function commitToDb(promise) {
    const [error, data] = await app.to(promise);
    if (error)
        return app.httpErrors.internalServerError(error.message);
    return data;
}
cron.schedule('0 */12 * * *', () => {
    collectDataAboutRankings(1000);
});
