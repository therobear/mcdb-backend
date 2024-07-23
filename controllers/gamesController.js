const gamesService = require('../services/gamesService');

const getGamesList = async (req, res) => {
    gamesService.getGamesList(req, res);
};

module.exports = {
    getGamesList,
};
