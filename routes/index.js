const express = require('express');
const router = express.Router();
const gamesController = require('../controllers/gamesController');
const mobyConrtoller = require('../controllers/mobyController');

// MCDB Calls
router.get('/games/', gamesController.getGamesList);
router.post('/games', gamesController.createGame);
router.put('/games/:gameid', gamesController.updateGame);
router.delete('/games/:gameid', gamesController.deleteGame);
router.get('/platforms', gamesController.getPlatformList);
router.post('/platforms', gamesController.createPlatform);
router.put('/platforms/:platformid', gamesController.updatePlatform);
router.delete('/platforms/:platformid', gamesController.deletePlatform);

// Moby Calls
router.get('/moby/searchGame', mobyConrtoller.searchGame);
router.get('/moby/searchGroup', mobyConrtoller.searchGroup);
router.get('/moby/covers', mobyConrtoller.getCovers);
router.get('/moby/games/:gameid', mobyConrtoller.getGame);
router.get('/moby/genres', mobyConrtoller.getGenres);
router.get('/moby/platforms', mobyConrtoller.getPlatforms);
router.get('/moby/screenshots', mobyConrtoller.getScreenshots);

module.exports = router;
