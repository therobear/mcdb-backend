const config = require('config');
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const logger = require('../utils/logger');
const models = require('../models');

const dbConfig = config.dbConfig;
const client = new MongoClient(
    `mongodb://${dbConfig.USER}:${dbConfig.PASSWORD}@${dbConfig.DATABASEHOST}:${dbConfig.DATABASEPORT}/${dbConfig.DATABASE}`
);

const Game = models.Game;
const Platform = models.Platform;
const GameGenre = models.GameGenre;

/**
 * Get a list of games entered in the database
 * @route GET /games
 * @group - MCDB Games
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
 * Get a game's information
 * @route GET /games/{gameid}
 * @group MCDB Games
 * @param {string} gameid.path.required - The id of the game
 * @return {Game} 200
 * @return {Error} 400
 */
const getGameInfo = async (req, res) => {
    const gameId = req.params.gameid;

    try {
        mongoose.connect(
            `mongodb://${dbConfig.USER}:${dbConfig.PASSWORD}@${dbConfig.DATABASEHOST}:${dbConfig.DATABASEPORT}/${dbConfig.DATABASE}`
        );

        await Game.findOne({ _id: gameId }).then((data) =>
            res.status(200).send(data)
        );
    } catch (err) {
        logger.error(err);
    }
};

/**
 * Add a game to the database
 * @route POST /games
 * @group MCDB Games
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
                    game.createdDate = new Date();
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
 * @route PUT /games/{gameid}
 * @group MCDB Games
 * @param {string} gameid.path.required - The id of the game you want to update
 * @param {Game.model} game.body.required - The game you want to update
 * @returns {string} 200
 * @returns {Error} 400 - Bad Request
 */
const updateGame = async (req, res) => {
    let gameId = req.params.gameid;
    let game = req.body;

    try {
        mongoose.connect(
            `mongodb://${dbConfig.USER}:${dbConfig.PASSWORD}@${dbConfig.DATABASEHOST}:${dbConfig.DATABASEPORT}/${dbConfig.DATABASE}`
        );

        await Game.updateOne(
            { _id: gameId },
            { ...game, modifiedDate: new Date() }
        ).then((updateData) => {
            logger.debug(updateData);
            res.status(200).send(`${game.title} was updated.`);
        });
    } catch (err) {
        logger.error(err);
    }
};

/**
 * Delete a game
 * @route DELETE /games/{gameid}
 * @group MCDB Games
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
            logger.debug(response);
            res.status(200).send('Game successfuly deleted.');
        });
    } catch (err) {
        logger.error(err);
    }
};

/**
 * Get a list of platforms entered in the database
 * @route GET /platforms
 * @group MCDB Game Platforms
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
 * Get a platform's information
 * @route GET /platforms/{platformid}
 * @group MCDB Game Platforms
 * @param {string} platformid.path.required - The id of the game
 * @return {Game} 200
 * @return {Error} 400
 */
const getPlatformInfo = async (req, res) => {
    const platformId = req.params.platformid;

    try {
        mongoose.connect(
            `mongodb://${dbConfig.USER}:${dbConfig.PASSWORD}@${dbConfig.DATABASEHOST}:${dbConfig.DATABASEPORT}/${dbConfig.DATABASE}`
        );

        await Platform.findOne({ _id: platformId }).then((data) => {
            data
                ? res.status(200).send(data)
                : res.status(200).send('Platform not found');
        });
    } catch (err) {
        logger.error(err);
    }
};

/**
 * Add a platform to the database
 * @route POST /platforms
 * @group MCDB Game Platforms
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

/**
 * Update a platform information
 * @route PUT /platforms/{platformid}
 * @group MCDB Game Platforms
 * @param {string} platformid.path.required - The id of the platform you want to update
 * @param {Platform.model} platform.body.required - The platform you want to update
 * @returns {String} 200
 * @returns {Error} 400 - Bad Request
 */
const updatePlatform = async (req, res) => {
    const platformId = req.params.platformid;
    const platform = req.body;

    try {
        mongoose.connect(
            `mongodb://${dbConfig.USER}:${dbConfig.PASSWORD}@${dbConfig.DATABASEHOST}:${dbConfig.DATABASEPORT}/${dbConfig.DATABASE}`
        );

        await Platform.updateOne(
            { _id: platformId },
            { name: platform.name, abbreviation: platform.abbreviation }
        ).then((updateData) => {
            logger.debug(updateData);
            res.status(200).send(`${platform.name} was updated.`);
        });
    } catch (err) {
        logger.error(err);
    }
};

/**
 * Delete a platform
 * @route DELETE /platforms/{platformid}
 * @group MCDB Game Platforms
 * @param {string} platformid.path.required - The id of the platform you want to delete
 * @returns {String} 200
 * @returns {Error} 400 - Bad Request
 */
const deletePlatform = async (req, res) => {
    const platformId = req.params.platformid;

    try {
        mongoose.connect(
            `mongodb://${dbConfig.USER}:${dbConfig.PASSWORD}@${dbConfig.DATABASEHOST}:${dbConfig.DATABASEPORT}/${dbConfig.DATABASE}`
        );

        await Platform.deleteOne({ _id: platformId }).then((response) => {
            logger.debug(response);
            res.status(200).send('Platform successfuly deleted.');
        });
    } catch (err) {
        logger.error(err);
    }
};

/**
 * Get a list of game genres entered in the database
 * @route GET /gameGenres
 * @group MCDB Game Genres
 * @returns {Array.<GameGenre>} 200
 * @return {Error} 400 - Bad Reqtest
 */
const getGameGenres = async (req, res) => {
    let gameGenreList = [];

    try {
        mongoose.connect(
            `mongodb://${dbConfig.USER}:${dbConfig.PASSWORD}@${dbConfig.DATABASEHOST}:${dbConfig.DATABASEPORT}/${dbConfig.DATABASE}`
        );

        const options = {
            sort: { name: 1 },
        };

        await GameGenre.find({}, null, options)
            .exec()
            .then((data) => {
                if (data.length > 0) gameGenreList = data;
                else logger.debug('No Game Genres found!');
            });

        res.status(200).send(gameGenreList);
    } catch (err) {
        logger.error(err);
    }
};

/**
 * Get the info for a game genre
 * @route GET /gameGenres/{genreid}
 * @group MCDB Game Genres
 * @param {string} genreid.path.required - The id of the game genre
 * @returns {GameGenre.model} 200
 * @returns {Error} 400 - Bad Request
 */
const getGameGenreInfo = async (req, res) => {
    const genreId = req.params.genreid;

    try {
        mongoose.connect(
            `mongodb://${dbConfig.USER}:${dbConfig.PASSWORD}@${dbConfig.DATABASEHOST}:${dbConfig.DATABASEPORT}/${dbConfig.DATABASE}`
        );

        await GameGenre.findOne({ _id: genreId }).then((data) => {
            data
                ? res.status(200).send(data)
                : res.status(200).send('Game Genre not found');
        });
    } catch (err) {
        logger.error(err);
    }
};

/**
 * Create a game genre entry
 * @route POST /gameGenres
 * @group MCDB Game Genres
 * @param {GameGenre.model} gameGenre.body.required - The game genre you want to add
 * @returns {string} 200
 * @returns {Error} 400 - Bad Request
 */
const createGameGenre = async (req, res) => {
    let gameGenre = req.body;

    try {
        mongoose.connect(
            `mongodb://${dbConfig.USER}:${dbConfig.PASSWORD}@${dbConfig.DATABASEHOST}:${dbConfig.DATABASEPORT}/${dbConfig.DATABASE}`
        );

        await GameGenre.findOne({ ...gameGenre })
            .exec()
            .then((data) => {
                if (!data) {
                    const item = new GameGenre(gameGenre);

                    item.save().then((data) =>
                        res
                            .status(200)
                            .send(
                                `Game genre ${data.name} created with _id ${data._id}`
                            )
                    );
                } else {
                    res.status(401).send(
                        `Platform ${gameGenre.name} already exists.`
                    );
                }
            });
    } catch (err) {
        logger.error(err);
    }
};

/**
 * Update a game genre entry
 * @route PUT /gameGenres/{genreid}
 * @group MCDB Game Genres
 * @param {string} genreid.path.required - The id of the game genre you want to update
 * @param {GameGenre.model} gameGenre.body.required - The game genre you want to update
 * @returns {string} 200
 * @returns {Error} 400 - Bad Request
 */
const updateGameGenre = async (req, res) => {
    const genreId = req.params.genreid;
    const gameGenre = req.body;

    try {
        mongoose.connect(
            `mongodb://${dbConfig.USER}:${dbConfig.PASSWORD}@${dbConfig.DATABASEHOST}:${dbConfig.DATABASEPORT}/${dbConfig.DATABASE}`
        );

        await GameGenre.updateOne(
            { _id: genreId },
            { name: gameGenre.name }
        ).then((updateData) => {
            logger.debug(updateData);
            res.status(200).send(`${gameGenre.name} was updated.`);
        });
    } catch (err) {
        logger.error(err);
    }
};

/**
 * Delete a game genre entry
 * @route DELETE /gameGenres/{genreid}
 * @group MCDB Game Genres
 * @param {string} genreid.path.required - The id of the game genre you want to delete
 * @returns {string} 200
 * @returns {Error} 400 - Bad Request
 */
const deleteGameGenre = async (req, res) => {
    const gameGenreId = req.params.genreid;

    try {
        mongoose.connect(
            `mongodb://${dbConfig.USER}:${dbConfig.PASSWORD}@${dbConfig.DATABASEHOST}:${dbConfig.DATABASEPORT}/${dbConfig.DATABASE}`
        );

        await GameGenre.deleteOne({ _id: gameGenreId }).then((response) => {
            logger.debug(response);
            res.status(200).send('Game Genre successfuly deleted.');
        });
    } catch (err) {
        logger.error(err);
    }
};

module.exports = {
    getGamesList,
    getGameInfo,
    createGame,
    updateGame,
    deleteGame,
    getPlatformList,
    getPlatformInfo,
    createPlatform,
    updatePlatform,
    deletePlatform,
    getGameGenres,
    getGameGenreInfo,
    createGameGenre,
    updateGameGenre,
    deleteGameGenre,
};
