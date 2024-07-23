const express = require('express');
const router = express.Router();
const gamesController = require('../controllers/gamesController');
const mobyConrtoller = require('../controllers/mobyController');

router.get('/games/', gamesController.getGamesList);

// Moby Calls
router.get('/moby/searchGame', mobyConrtoller.searchGame);
router.get('/moby/genres', mobyConrtoller.getGenres);
router.get('/moby/platforms', mobyConrtoller.getPlatforms);

module.exports = router;
