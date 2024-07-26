const config = require('config');
const mongoose = require('mongoose');
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
    let game = req.body;
    let result;

    try {
        mongoose.connect(
            `mongodb://${dbConfig.USER}:${dbConfig.PASSWORD}@${dbConfig.DATABASEHOST}:${dbConfig.DATABASEPORT}/${dbConfig.DATABASE}`
        );

        await Game.findOne({ title: game.title })
            .exec()
            .then((data) => {
                if (data) {
                    game.ownedPlatforms.forEach((platform, index) => {
                        data.ownedPlatforms.forEach((owned, index) => {
                            if (owned === platform) {
                                return res
                                    .status(200)
                                    .send(`${game.title} already exists!`);
                            } else {
                                let platforms = data.ownedPlatforms;

                                const newPlatform = Game.updateOne(
                                    { title: game.title },
                                    {
                                        '$push': {
                                            'ownedPlatforms': platform,
                                        },
                                    }
                                ).then((updateData) => {
                                    res.status(200).send(
                                        `${platform} was added to Owned Platforms for ${game.title}`
                                    );
                                });
                            }
                        });
                    });
                } else {
                    const newGame = new Game(game);

                    newGame
                        .save()
                        .then((data) =>
                            res
                                .status(200)
                                .send(
                                    `${game.title} has been added to the database!`
                                )
                        );
                }
            });
    } catch (err) {
        logger.error(err);
    }
};

/**
 * Update a game information
 * @route PUT /games
 * @group MCDB
 * @param {Game.model} game.body.required - The game you want to add
 * @returns {String} 200
 * @returns {Error} 400 - Bad Request
 */
const updateGame = async (req, res) => {
    let game = req.body;

    try {
        mongoose.connect(
            `mongodb://${dbConfig.USER}:${dbConfig.PASSWORD}@${dbConfig.DATABASEHOST}:${dbConfig.DATABASEPORT}/${dbConfig.DATABASE}`
        );

        await Game.updateOne({ title: game.title }, { ...game }).then(
            (updateData) => {
                res.status(200).send(`${game.title} was updated.`);
            }
        );
    } catch (err) {
        logger.error(err);
    }
};

/**
 * Delete a game
 * @route DELETE /games/{gameid}
 * @group MCDB
 * @param {string} gameid.path.required - The id of the game you want to delete
 * @returns {string} 200
 * @returns {Error} 400 - Bad Request
 */
const deleteGame = async (req, res) => {
    console.log(req.params);
    const gameId = req.params.gameid;

    try {
        mongoose.connect(
            `mongodb://${dbConfig.USER}:${dbConfig.PASSWORD}@${dbConfig.DATABASEHOST}:${dbConfig.DATABASEPORT}/${dbConfig.DATABASE}`
        );

        await Game.deleteOne({ _id: gameId }).then((response) => {
            res.status(200).send('Game successfuly deleted.');
        });
    } catch (err) {
        logger.error(err);
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
        mongoose.connect(
            `mongodb://${dbConfig.USER}:${dbConfig.PASSWORD}@${dbConfig.DATABASEHOST}:${dbConfig.DATABASEPORT}/${dbConfig.DATABASE}`
        );

        const options = {
            sort: { name: 1 },
        };

        await Platform.find({}, null, options)
            .exec()
            .then((data) => {
                if (data.length > 0) platformList = data;
                else logger.debug('No Platforms found!');
            });

        res.status(200).send(platformList);
    } catch (err) {
        logger.error(err);
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

    try {
        mongoose.connect(
            `mongodb://${dbConfig.USER}:${dbConfig.PASSWORD}@${dbConfig.DATABASEHOST}:${dbConfig.DATABASEPORT}/${dbConfig.DATABASE}`
        );

        await Platform.findOne({ ...platform })
            .exec()
            .then((data) => {
                if (!data) {
                    const item = new Platform(platform);

                    item.save().then((data) =>
                        res
                            .status(200)
                            .send(
                                `Platform ${data.name} created with _id ${data._id}`
                            )
                    );
                } else {
                    res.status(401).send(
                        `Platform ${platform.name} already exists.`
                    );
                }
            });
    } catch (err) {
        logger.error(err);
    }
};

module.exports = {
    getGamesList,
    createGame,
    updateGame,
    deleteGame,
    getPlatformList,
    createPlatform,
};
