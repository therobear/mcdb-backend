const mongoose = require('mongoose');

const { Schema, model } = mongoose;

/**
 * @typedef GameGenre
 * @property {string} name
 */
const GameGenreSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
});

const GameGenre = model('gamegenres', GameGenreSchema);

module.exports = GameGenre;
