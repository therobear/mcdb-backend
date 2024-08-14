const mongoose = require('mongoose');

const { Schema, model } = mongoose;

/**
 * @typedef Platform
 * @property {String} name
 * @property {String} abbreviation
 */
const PlatformSchema = new Schema({
    name: String,
    abbreviation: String,
});

const Platform = model('platforms', PlatformSchema);

module.exports = Platform;
