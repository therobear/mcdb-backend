const Platform = require('./Platform');
const MobyPlatform = require('./MobyPlatform');
const mongoose = require('mongoose');

const { Schema, model } = mongoose;

/**
 * @typedef Game
 * @property {string} title
 * @property {string} description
 * @property {string} coverUrl
 * @property {Array.<MobyPlatform>}platforms
 * @property {Array.<string>}screenshots
 * @property {Array.<string>}ownedPlatforms
 */
const GameSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: '',
    },
    coverUrl: {
        type: String,
        default: '',
    },
    platforms: {
        type: [MobyPlatform.schema],
        default: {},
    },
    screenshots: {
        type: [String],
        default: [],
    },
    ownedPlatforms: {
        type: [String],
        default: [],
    },
});

const Game = model('games', GameSchema);

module.exports = Game;
