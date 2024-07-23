const mobyServices = require('../services/mobyServices');

const searchGame = async (req, res) => {
    mobyServices.searchGame(req, res);
};

const searchGroup = async (req, res) => {
    mobyServices.searchGroup(req, res);
};

const getCovers = async (req, res) => {
    mobyServices.getCovers(req, res);
};

const getGame = async (req, res) => {
    mobyServices.getGame(req, res);
};

const getGenres = async (req, res) => {
    mobyServices.getGenres(req, res);
};

const getPlatforms = async (req, res) => {
    mobyServices.getPlatforms(req, res);
};

const getScreenshots = async (req, res) => {
    mobyServices.getScreenshots(req, res);
};

module.exports = {
    searchGame,
    searchGroup,
    getCovers,
    getGame,
    getGenres,
    getPlatforms,
    getScreenshots,
};
