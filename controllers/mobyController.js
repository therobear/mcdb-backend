const mobyServices = require('../services/mobyServices');

const searchGame = async (req, res) => {
    mobyServices.searchGame(req, res);
};

const getGenres = async (req, res) => {
    mobyServices.getGenres(req, res);
};

const getPlatforms = async (req, res) => {
    mobyServices.getPlatforms(req, res);
};

module.exports = {
    searchGame,
    getGenres,
    getPlatforms,
};
