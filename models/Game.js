const MobyPlatform = require('./MobyPlatform');
const GameGenre = require('./GameGenre');
const mongoose = require('mongoose');

const { Schema, model } = mongoose;

/**
 * @typedef Game
 * @property {string} title
 * @property {string} description
 * @property {string} coverUrl
 * @property {Array.<MobyPlatform>} platforms
 * @property {Array.<string>} screenshots
 * @property {Array.<string>} ownedPlatforms
 * @property {Array.<GameGenre>} genres
 * @property {Date} createdDate
 * @property {Date} modifiedDate
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
    genres: {
        type: [GameGenre.schema],
        default: [],
    },
    createdDate: Date,
    modifiedDate: Date,
});

const Game = model('games', GameSchema);

module.exports = Game;
