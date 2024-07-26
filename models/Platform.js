const mongoose = require('mongoose');

const { Schema, model } = mongoose;

/**
 * @typedef Platform
 * @property {string} name
 */
const PlatformSchema = new Schema({
    name: String,
});

const Platform = model('platforms', PlatformSchema);

module.exports = Platform;
