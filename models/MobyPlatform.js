const mongoose = require('mongoose');

const { Schema, model } = mongoose;

/**
 * @typedef MobyPlatform
 * @property {string} releaseDate
 * @property {string} platformName;
 */
const MobyPlatformSchema = new Schema({
    releaseDate: String,
    platformName: String,
});

const MobyPlatform = model('', MobyPlatformSchema);

module.exports = MobyPlatform;
