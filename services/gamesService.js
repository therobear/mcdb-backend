const config = require('config');
const MongoClient = require('mongodb').MongoClient;
const logger = require('../utils/logger');

const dbConfig = config.dbConfig;
const client = new MongoClient(
    `mongodb://${dbConfig.USER}:${dbConfig.PASSWORD}@${dbConfig.DATABASEHOST}:${dbConfig.DATABASEPORT}/${dbConfig.DATABASE}`
);

const Game = require('../models/Game');
const Platform = require('../models/Platform');

/**
 * Get a list of games entered in the database
 * @route GET /games
 * @group - MCDB
 * @produces application/json
 * @returns {Array.<object>} 200
 */
const getGamesList = async (req, res) => {
    let gamesList = [];

    try {
        const options = {
            sort: { Title: 1 },
        };

        await client
            .connect()
            .then(() => logger.debug('Connected to mongodb'))
            .catch((err) => logger.error(err));

        const db = client.db(`${dbConfig.DATABASE}`);
        const games = db.collection(`${dbConfig.GAMESCOLLECTION}`);

        const gamesQuery = games.find({}, options);

        if ((await games.countDocuments({})) === 0) {
            logger.debug('No games found!');
        }

        for await (const game of gamesQuery) {
            gamesList.push(game);
        }
    } finally {
        await client.close();
        return res.status(200).send(gamesList);
    }
};

/**
 * Add a game to the database
 * @route POST /games
 * @group MCDB
 * @param {Game.model} game.body.required - The game you want to add
 * @returns {String} 200
 * @returns {Error} 400 - Bad Request
 */
const createGame = async (req, res) => {
    let game = req.body.game;
    let result;

    try {
        await client
            .connect()
            .then(() => logger.debug('Connected to mongodb'))
            .catch((err) => logger.error(err));

        const db = client.db(`${dbConfig.DATABASE}`);
        const games = db.collection(`${dbConfig.GAMESCOLLECTION}`);

        result = await games.insertOne(game);
    } finally {
        await client.close();
        return res
            .status(200)
            .send(`Game successfuly added with id ${result.insertedId}!`);
    }
};

/**
 * Get a list of platforms entered in the database
 * @route GET /platforms
 * @group MCDB
 * @returns {Array.<Platform>} 200
 * @returns {Error} 400
 */
const getPlatformList = async (req, res) => {
    let platformList = [];

    try {
        const options = {
            sort: { Name: 1 },
        };

        await client
            .connect()
            .then(() => logger.debug('Connected to mongodb'))
            .catch((err) => logger.error(err));

        const db = client.db(`${dbConfig.DATABASE}`);
        const platforms = db.collection(`${dbConfig.PLATFORMSCOLLECTION}`);

        const platformQuery = platforms.find({}, options);

        if ((await platforms.countDocuments({})) === 0) {
            logger.debug('No platforms found!');
        }

        for await (const platform of platformQuery) {
            platformList.push(platform);
        }
    } finally {
        await client.close();
        return res.status(200).send(platformList);
    }
};

/**
 * Add a platform to the database
 * @route PUT /platforms
 * @group MCDB
 * @param {Platform.model} platform.body.required - The platform you want to add
 * @returns {String} 200
 * @returns {Error} 400 - Bad Request
 */
const createPlatform = async (req, res) => {
    let platform = req.body;
    let result;

    try {
        await client
            .connect()
            .then(() => logger.debug('Connected to mongodb'))
            .catch((err) => logger.error(err));

        const db = client.db(`${dbConfig.DATABASE}`);
        const platforms = db.collection(`${dbConfig.PLATFORMSCOLLECTION}`);

        result = await platforms.insertOne(platform);
    } finally {
        await client.close();
        console.log(res);
        return res.status(200).send(`Game successfuly added with id ${res}!`);
    }
};

module.exports = {
    getGamesList,
    createGame,
    getPlatformList,
    createPlatform,
};
