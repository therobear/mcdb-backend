const models = {};

models.Game = require('./Game');
models.Platform = require('./Platform');
models.GameGenre = require('./GameGenre');

models.MobyGameDTO = require('./MobyGameDTO');
models.MobyPlatform = require('./MobyPlatform');

module.exports = models;
