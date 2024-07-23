const express = require('express');
const config = require('config');
const mobyConfig = config.mobyConfig;
const mobyEndpoints = config.mobyEndpoints;
const axios = require('axios');
const logger = require('../utils/logger');

/**
 * Search for a game by name
 * @route GET /moby/searchGame
 * @group Moby Games
 * @param {string} title.query.required = The title of the game
 * @returns {Array.<object>} 200
 * @returns {Error} 400 - Bad Request
 */
const searchGame = async (req, res) => {
    const title = req.query.title;

    try {
        await axios
            .get(
                `${mobyEndpoints.BASEURL}/${mobyEndpoints.GAMES}?title=${title}&api_key=${mobyConfig.APIKEY}`
            )
            .then((response) => res.status(200).send(response.data));
    } catch (err) {
        logger.error(err.message);
    }
};

/**
 * Get a list of Moby game genres
 * @route GET /moby/genres
 * @group Moby Games
 * @returns {Array.<object>} 200
 * @returns {Error} 400 - Bad Request
 */
const getGenres = async (req, res) => {
    try {
        await axios
            .get(
                `${mobyEndpoints.BASEURL}/${mobyEndpoints.GENRES}?api_key=${mobyConfig.APIKEY}`
            )
            .then((response) => res.status(200).send(response.data));
    } catch (err) {
        logger.error(err.stack);
    }
};

/**
 * Get a list of Moby platforms
 * @route GET /moby/platforms
 * @group Moby Games
 * @returns {Array.<object>} 200
 * @returns {Error} 400 - Bad Request
 */
const getPlatforms = async (req, res) => {
    try {
        await axios
            .get(
                `${mobyEndpoints.BASEURL}/${mobyEndpoints.PLATFORMS}?api_key=${mobyConfig.APIKEY}`
            )
            .then((response) => res.status(200).send(response.data));
    } catch (err) {
        logger.error(err.stack);
    }
};

module.exports = {
    searchGame,
    getGenres,
    getPlatforms,
};
