const mongoose = require('mongoose');

const { Schema, model } = mongoose;

/**
 * @typedef Platform
 * @property {String} name
 * @property {String} abbreviation
 */
const PlatformSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    abbreviation: {
        type: String,
        required: true,
    },
});

const Platform = model('platforms', PlatformSchema);

module.exports = Platform;
