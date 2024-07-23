const config = require('config');
const MongoClient = require('mongodb').MongoClient;
const logger = require('../utils/logger');

const dbConfig = config.dbConfig;
const client = new MongoClient(
    `mongodb://${dbConfig.USER}:${dbConfig.PASSWORD}@${dbConfig.DATABASEHOST}:${dbConfig.DATABASEPORT}/${dbConfig.DATABASE}`
);

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
            sort: { title: 1 },
        };

        await client
            .connect()
            .then(() => logger.debug('Connected to mongodb'))
            .catch((err) => logger.error(err));

        const db = client.db(`${dbConfig.DATABASE}`);
        const games = db.collection('games');

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

module.exports = {
    getGamesList,
};
