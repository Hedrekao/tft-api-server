import fastify from 'fastify';
import dotenv from 'dotenv';
import sensible from '@fastify/sensible';
import cookies from '@fastify/cookie';
import fastifyIO from 'fastify-socket.io';
import { PrismaClient } from '@prisma/client';
import cors from '@fastify/cors';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import getSummonersData from './routes_functions/summonerRoute.js';
import analyzeComposition from './routes_functions/analyzeCompRoute.js';
import collectDataAboutRankings from './task_functions/collectDataAboutRankings.js';
import getPerformanceForCoreUnits from './routes_functions/cmsRoute.js';
import saveCompositionIntoDatabase from './routes_functions/cmsSaveRoute.js';
import getCompsFromDb from './routes_functions/preparedCompsRoute.js';
import getLeaderboardData from './routes_functions/leaderboardRoute.js';
import register from './routes_functions/registerRoute.js';
import login from './routes_functions/loginRoute.js';
import getSummonerBasicData from './routes_functions/summonerBasicRoute.js';
import timeSince from './helper_functions/summonerRoute/timeSince.js';
import { cache } from './helper_functions/singletonCache.js';
dotenv.config();
axios.defaults.headers.common['X-Riot-Token'] = process.env.API_KEY;
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.timeout = 5000;
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
app.register(cookies, {
    hook: 'onRequest',
    parseOptions: {} // options for parsing cookies
});
const port = process.env.PORT || 8080;
const prisma = new PrismaClient();
app.post('/comps', async (req, res) => {
    console.log(req.body.inputData);
    const io = app.io;
    console.log(req.body.socketSessionId);
    const result = await analyzeComposition(req.body.inputData, req.body.socketSessionId, io, 1000, 650);
    if (result.hasOwnProperty('error')) {
        res.code(502).send(result);
    }
    else {
        res.code(200).send(result);
    }
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
    if (req.headers['x-api-key'] == process.env.CMS_API_KEY) {
        return await getPerformanceForCoreUnits(req.body.inputData, 1000, 1000);
    }
    else {
        res.code(401).send(new Error('You are not authorized'));
    }
});
app.get('/preparedComps', (req, res) => {
    try {
        return getCompsFromDb();
    }
    catch (error) {
        return { error: error.message };
    }
});
app.get('/cms/comps', async (req, res) => {
    try {
        if (req.headers['x-api-key'] == process.env.CMS_API_KEY) {
            const comps = await prisma.compositionJSON.findMany();
            return comps.map((comp) => {
                const result = {
                    id: Number(comp.id),
                    json: comp.json,
                    visibility: comp.visibility
                };
                return result;
            });
        }
        else {
            res.code(401).send(new Error('You are not authorized'));
        }
    }
    catch (error) {
        return { error: error.message };
    }
});
app.post('/cms/changeVisibility', async (req, res) => {
    try {
        if (req.headers['x-api-key'] == process.env.CMS_API_KEY) {
            await prisma.compositionJSON.update({
                where: { id: req.body.id },
                data: { visibility: req.body.visibility }
            });
            return { info: 'visibility updated' };
        }
        else {
            res.code(401).send(new Error('You are not authorized'));
        }
    }
    catch (error) {
        return { error: error.message };
    }
});
app.delete('/cms/comps/:id', async (req, res) => {
    try {
        if (req.headers['x-api-key'] == process.env.CMS_API_KEY) {
            const id = parseInt(req.params.id);
            await prisma.compositionJSON.delete({
                where: { id: id }
            });
            return { info: 'composition deleted' };
        }
        else {
            res.code(401).send(new Error('You are not authorized'));
        }
    }
    catch (error) {
        return { error: error.message };
    }
});
app.post('/cms/save', async (req, res) => {
    try {
        if (req.headers['x-api-key'] == process.env.CMS_API_KEY) {
            console.log(JSON.stringify(req.body.composition));
            await saveCompositionIntoDatabase(req.body.composition);
            return { info: 'data succesfully saved' };
        }
        else {
            res.code(401).send(new Error('You are not authorized'));
        }
    }
    catch (e) {
        console.log(e.message);
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
        if (a.avg_place < b.avg_place) {
            return -1;
        }
        else if (a.avg_place > b.avg_place) {
            return 1;
        }
        else {
            if (a.frequency > b.frequency) {
                return -1;
            }
            else if (a.frequency < b.frequency) {
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
app.get('/compare-augments', async (req, res) => {
    const overallAugments = await prisma.augments_ranking.findMany();
    const numberOfCompsQuery = await prisma.general_data.findUnique({
        where: { id: 1 }
    });
    const numberOfComps = numberOfCompsQuery?.totalNumberOfComps;
    const firstStageAugments = await prisma.augments_first_choice_ranking.findMany();
    const secondStageAugments = await prisma.augments_second_choice_ranking.findMany();
    const thirdStageAugments = await prisma.augments_third_choice_ranking.findMany();
    const result = overallAugments.map((augment) => {
        const object = {
            id: augment.id,
            overall_avg_place: (augment.sumOfPlacements /
                (augment.numberOfAppearances != 0 ? augment.numberOfAppearances : 1)).toFixed(2),
            overall_frequency: ((augment.numberOfAppearances / numberOfComps) *
                100).toFixed(2),
            overall_winrate: ((augment.sumOfWins /
                (augment.numberOfAppearances != 0
                    ? augment.numberOfAppearances
                    : 1)) *
                100).toFixed(2)
        };
        const firstAugment = firstStageAugments.find((item) => item.id == augment.id);
        if (firstAugment != undefined) {
            object['first_tier_avg_place'] = (firstAugment.sumOfPlacements /
                (firstAugment.numberOfAppearances != 0
                    ? firstAugment.numberOfAppearances
                    : 1)).toFixed(2);
            object['first_tier_frequency'] = ((firstAugment.numberOfAppearances / numberOfComps) *
                100 *
                3).toFixed(2);
            object['first_tier_winrate'] = ((firstAugment.sumOfWins /
                (firstAugment.numberOfAppearances != 0
                    ? firstAugment.numberOfAppearances
                    : 1)) *
                100).toFixed(2);
        }
        else {
            object['first_tier_avg_place'] = '';
            object['first_tier_frequency'] = '';
            object['first_tier_winrate'] = '';
        }
        const secondAugment = secondStageAugments.find((item) => item.id == augment.id);
        if (secondAugment != undefined) {
            object['second_tier_avg_place'] = (secondAugment.sumOfPlacements /
                (secondAugment.numberOfAppearances != 0
                    ? secondAugment.numberOfAppearances
                    : 1)).toFixed(2);
            object['second_tier_frequency'] = ((secondAugment.numberOfAppearances / numberOfComps) *
                100 *
                3).toFixed(2);
            object['second_tier_winrate'] = ((secondAugment.sumOfWins /
                (secondAugment.numberOfAppearances != 0
                    ? secondAugment.numberOfAppearances
                    : 1)) *
                100).toFixed(2);
        }
        else {
            object['second_tier_avg_place'] = '';
            object['second_tier_frequency'] = '';
            object['second_tier_winrate'] = '';
        }
        const thirdAugment = thirdStageAugments.find((item) => item.id == augment.id);
        if (thirdAugment != undefined) {
            object['third_tier_avg_place'] = (thirdAugment.sumOfPlacements /
                (thirdAugment.numberOfAppearances != 0
                    ? thirdAugment.numberOfAppearances
                    : 1)).toFixed(2);
            object['third_tier_frequency'] = ((thirdAugment.numberOfAppearances / numberOfComps) *
                100 *
                3).toFixed(2);
            object['third_tier_winrate'] = ((thirdAugment.sumOfWins /
                (thirdAugment.numberOfAppearances != 0
                    ? thirdAugment.numberOfAppearances
                    : 1)) *
                100).toFixed(2);
        }
        else {
            object['third_tier_avg_place'] = '';
            object['third_tier_frequency'] = '';
            object['third_tier_winrate'] = '';
        }
        return object;
    });
    return result;
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
            frequency: ((augment.numberOfAppearances / numberOfComps) *
                100 *
                3).toFixed(2),
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
    return await collectDataAboutRankings(1000);
});
app.get('/unit/:id', async (req, res) => {
    return await commitToDb(prisma.champions.findUnique({
        where: {
            id: req.params.id
        }
    }));
});
app.post('/register', async (req, res) => {
    try {
        const user = req.body.user;
        if (await register(user)) {
            res.code(201).send({ message: 'User was registered' });
        }
        else {
            res.code(502).send(new Error('Something went wrong'));
        }
    }
    catch (error) {
        return { error: error.message };
    }
});
app.post('/verifyEmail', (req, res) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    let code = '';
    for (let index = 0; index < 4; index++) {
        const element = Math.floor(Math.random() * 10);
        code += element;
    }
    const mailOptions = {
        from: process.env.EMAIL,
        to: req.body.email,
        subject: 'Account verification - tactixgg',
        text: 'Here is the verification code: ' + code
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            res.code(502).send({ error: error.message });
        }
        else {
            transporter.close();
            res.code(201).send({ verificationCode: code });
        }
    });
});
app.get('/riotAccount/:region/:name', async (req, res) => {
    try {
        const summonerData = await getSummonerBasicData(req.params.region, req.params.name);
        if (summonerData == undefined) {
            res.code(502).send({ error: 'something went wrong' });
        }
        res.code(200).send(summonerData);
    }
    catch (error) { }
});
app.post('/login', async (req, res) => {
    try {
        const user = req.body.user;
        const result = await login(user);
        cache.set(user.email, result.token);
        res
            .code(200)
            .setCookie('jwt', result.token, {
            domain: 'tactix.gg',
            path: '/',
            maxAge: 2147483647
        })
            .send({
            message: 'You are logged in',
            summonerName: result.user.summonerName,
            region: result.user.region,
            username: result.user.userName
        });
    }
    catch (error) {
        res.code(502).send({ error: error.message });
    }
});
app.get('/logout', (req, res) => {
    try {
        const token = req.cookies.jwt;
        if (token == undefined) {
            throw new Error('Error with logging out');
        }
        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
        cache.del(payload['email']);
        res.code(200).clearCookie('jwt').send({ message: 'you have been log out' });
    }
    catch (error) {
        res.code(502).send({ error: error.message });
    }
});
app.post('/resetPasswordMail', async (req, res) => {
    try {
        const email = req.body.email;
        const user = await prisma.users.findFirstOrThrow({
            where: { email: email }
        });
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });
        const payload = {
            email: user.email
        };
        const token_mail_verification = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
            expiresIn: '10m'
        });
        const mailOptions = {
            from: process.env.EMAIL,
            to: req.body.email,
            subject: 'Password reset - tactix.gg',
            text: `Here is the link to reset password: https://tactix.gg/resetPassword/${token_mail_verification}`
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                res.code(502).send({ error: error.message });
            }
            else {
                transporter.close();
                res.code(200).send({ message: 'email has been sent' });
            }
        });
    }
    catch (error) {
        res.code(502).send({ error: error.message });
    }
});
app.post('/resetPassword', (req, res) => {
    try {
        const password = req.body.password;
        const token = req.body.token;
        if (token && password) {
            jwt.verify(token, process.env.JWT_SECRET_KEY, async (e, decoded) => {
                if (e) {
                    console.log(e);
                    return res.code(403);
                }
                else {
                    if (decoded == undefined) {
                        return res.code(403);
                    }
                    const email = decoded['email'];
                    const encryptedPassword = await bcrypt.hash(password, 10);
                    await prisma.users.update({
                        where: { email: email },
                        data: { password: encryptedPassword }
                    });
                    res.code(200).send({ message: 'Password has been changed' });
                }
            });
        }
        else {
            return res.code(403);
        }
    }
    catch (error) {
        res.code(403).send({ error: error.message });
    }
});
app.get('/generalData', async (req, res) => {
    try {
        const general_data = await prisma.general_data.findUnique({
            where: { id: 1 }
        });
        if (general_data == null) {
            throw new Error('no data found');
        }
        const timeSinceNow = timeSince(general_data.lastChange * 1000);
        res.code(200).send({
            lastChange: timeSinceNow,
            analyzedComps: general_data.totalNumberOfComps
        });
    }
    catch (error) {
        res.code(502).send({ error: error.message });
    }
});
app.ready().then(async () => {
    app.io.on('connection', (socket) => {
        socket.on('connectInit', (sessionId) => {
            // The socket ID is stored along with the unique ID generated by the client
            console.log(sessionId);
            if (sessionId != undefined) {
                cache.set(sessionId, socket.id, 600);
            }
        });
    });
    const rawDataDragon = (await axios.get('https://raw.communitydragon.org/latest/cdragon/tft/en_us.json'))?.data;
    const augmentsPairs = [];
    const itemsPairs = [];
    rawDataDragon.items.forEach((val) => {
        if (val.apiName.includes('Augment')) {
            augmentsPairs.push([val.apiName, val]);
        }
        else if (val.apiName.includes('Item')) {
            itemsPairs.push([val.apiName, val]);
        }
    });
    const improvedItems = Object.fromEntries(itemsPairs);
    const improvedAugments = Object.fromEntries(augmentsPairs);
    const improvedSets = {};
    for (const setName in rawDataDragon.sets) {
        const set = rawDataDragon.sets[setName];
        const improvedUnits = set.champions.reduce((prev, val) => {
            prev[val.apiName] = {
                ...val
            };
            delete prev[val.apiName]['apiName'];
            return prev;
        }, {});
        const improvedTraits = set.traits.reduce((prev, val) => {
            prev[val.apiName] = {
                ...val
            };
            delete prev[val.apiName]['apiName'];
            return prev;
        }, {});
        improvedSets[setName] = {
            name: set.name,
            champions: improvedUnits,
            traits: improvedTraits
        };
    }
    const dataDragon = {
        ...rawDataDragon,
        augments: improvedAugments,
        sets: improvedSets,
        items: improvedItems
    };
    cache.set('dataDragon', dataDragon, 0);
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
// TODO RETHINK CRON JOB (GO THROUGH CODE, MAYBE ALTERNATIVE TO NODE CRONE)
// cron.schedule('0 */12 * * *', () => {
//   collectDataAboutRankings(1000);
// });
