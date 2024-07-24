const gamesService = require('../services/gamesService');

const getGamesList = async (req, res) => {
    gamesService.getGamesList(req, res);
};

const createGame = async (req, res) => {
    gamesService.createGame(req, res);
};

const getPlatformList = async (req, res) => {
    gamesService.getPlatformList(req, res);
};

const createPlatform = async (req, res) => {
    gamesService.createPlatform(req, res);
};

module.exports = {
    getGamesList,
    createGame,
    getPlatformList,
    createPlatform,
};
