const express = require('express');
const config = require('config');
const mobyConfig = config.mobyConfig;
const mobyEndpoints = config.mobyEndpoints;
const axios = require('axios');
const logger = require('../utils/logger');

const MobyGameDTO = require('../models/MobyGameDTO');
const MobyPlatform = require('../models/MobyPlatform');

/**
 * Search for a game by name
 * @route GET /moby/searchGame
 * @group Moby Games
 * @param {string} title.query.required - The title of the game
 * @returns {Array.<MobyGameDTO>} 200
 * @returns {Error} 400 - Bad Request
 */
const searchGame = async (req, res) => {
    const gameList = [];
    const title = req.query.title;

    try {
        await axios
            .get(
                `${mobyEndpoints.BASEURL}/${mobyEndpoints.GAMES}?title=${title}&api_key=${mobyConfig.APIKEY}`
            )
            .then((response) => {
                //res.status(200).send(response.data)
                response.data.games.map((entry, index) => {
                    let game = { ...entry };
                    let screenshots = [];

                    if (entry.sample_screenshots.length > 0) {
                        entry.sample_screenshots.map((screenshot, index) => {
                            if (screenshot.image)
                                screenshots.push(screenshot.image);
                        });
                    }

                    game.screenshots = screenshots;

                    gameList.push(new MobyGameDTO(game));
                });

                res.status(200).send(gameList);
            });
    } catch (err) {
        logger.error(err.config?.url);
        logger.error(err.stack);
        logger.error(err.response?.data.error);
        return res.status(err.response.status).send(err.response.data.error);
    }
};

/**
 * Search for a group by name
 * @route GET /moby/searchGroup
 * @group Moby Games
 * @returns {Array.<object>} 200
 * @returns {Error} 400 - Bad Request
 */
const searchGroup = async (req, res) => {
    try {
        await axios
            .get(
                `${mobyEndpoints.BASEURL}/${mobyEndpoints.GROUPS}?api_key=${mobyConfig.APIKEY}`
            )
            .then((response) => res.status(200).send(response.data));
    } catch (err) {
        logger.error(err.config?.url);
        logger.error(err.stack);
        logger.error(err.response?.data.error);
        return res.status(err.response.status).send(err.response.data.error);
    }
};

/**
 * Get covers for a specific game
 * @route GET /moby/covers
 * @group Moby Games
 * @param {string} gameid.query.required - The id of the game
 * @param {string} platformid.query.required - The id of the platform
 * @returns {Array.<object>} 200
 * @returns {Error} 400 - Bad Request
 */
const getCovers = async (req, res) => {
    const gameId = req.query.gameid;
    const platformId = req.query.platformid;

    try {
        await axios
            .get(
                `${mobyEndpoints.BASEURL}/${mobyEndpoints.GAMES}/${gameId}/platforms/${platformId}/${mobyEndpoints.COVERS}?api_key=${mobyConfig.APIKEY}`
            )
            .then((response) => res.status(200).send(response.data));
    } catch (err) {
        logger.error(err.config?.url);
        logger.error(err.stack);
        logger.error(err.response?.data.error);
        return res.status(err.response.status).send(err.response.data.error);
    }
};

/**
 * Get info for a game by id
 * @route GET /moby/games/{gameid}
 * @group Moby Games
 * @param {string} gameid.path.required - The id of the game
 * @returns {Array.<object>} 200
 * @returns {Error} 400 - Bad Request
 * @returns {Error} 404 - Not Found
 */
const getGame = async (req, res) => {
    const gameId = req.params.gameid;

    try {
        await axios
            .get(
                `${mobyEndpoints.BASEURL}/${mobyEndpoints.GAMES}/${gameId}?api_key=${mobyConfig.APIKEY}`
            )
            .then((response) => res.status(200).send(response.data));
    } catch (err) {
        logger.error(err.config?.url);
        logger.error(err.stack);
        logger.error(err.response?.data.error);
        return res.status(err.response.status).send(err.response.data.error);
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
        logger.error(err.config?.url);
        logger.error(err.stack);
        logger.error(err.response?.data.error);
        return res.status(err.response.status).send(err.response.data.error);
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
        logger.error(err.config?.url);
        logger.error(err.stack);
        logger.error(err.response?.data.error);
        return res.status(err.response.status).send(err.response.data.error);
    }
};

/**
 * Get screen shots for a specific game
 * @route GET /moby/screenshots
 * @group Moby Games
 * @param {string} gameid.query.required - The id of the game
 * @param {string} platformid.query.required - The id of the platform
 * @returns {Array.<object>} 200
 * @returns {Error} 400 - Bad Request
 */
const getScreenshots = async (req, res) => {
    const gameId = req.query.gameid;
    const platformId = req.query.platformid;

    try {
        await axios
            .get(
                `${mobyEndpoints.BASEURL}/${mobyEndpoints.GAMES}/${gameId}/platforms/${platformId}/${mobyEndpoints.SCREENSHOTS}?api_key=${mobyConfig.APIKEY}`
            )
            .then((response) => res.status(200).send(response.data));
    } catch (err) {
        logger.error(err.config?.url);
        logger.error(err.stack);
        logger.error(err.response?.data.error);
        return res.status(err.response.status).send(err.response.data.error);
    }
};

module.exports = {
    searchGame,
    searchGroup,
    getCovers,
    getGame,
    getGenres,
    getPlatforms,
    getScreenshots,
};
