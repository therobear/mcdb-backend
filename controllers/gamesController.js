const gamesService = require('../services/gamesService');

const getGamesList = async (req, res) => {
    gamesService.getGamesList(req, res);
};

const getGameInfo = async (req, res) => {
    gamesService.getGameInfo(req, res);
};

const createGame = async (req, res) => {
    gamesService.createGame(req, res);
};

const updateGame = async (req, res) => {
    gamesService.updateGame(req, res);
};

const deleteGame = async (req, res) => {
    gamesService.deleteGame(req, res);
};

const getPlatformList = async (req, res) => {
    gamesService.getPlatformList(req, res);
};

const getPlatformInfo = async (req, res) => {
    gamesService.getPlatformInfo(req, res);
};

const createPlatform = async (req, res) => {
    gamesService.createPlatform(req, res);
};

const updatePlatform = async (req, res) => {
    gamesService.updatePlatform(req, res);
};

const deletePlatform = async (req, res) => {
    gamesService.deletePlatform(req, res);
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
};
