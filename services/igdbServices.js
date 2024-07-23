const express = require('express');
const config = require('config');
const igdbConfig = config.igdbConfig;
const igdbEndpoints = config.igdbEndpoints;
const axios = require('axios');
const logger = require('../utils/logger');

const models = require('../models');

const igdbGame = models.igdbGame;
const igdbResultDTO = models.igdbResultDTO;

const headerConfig = {
    Accept: 'application.json',
    'Client-ID': igdbConfig.CLIENTID,
    Authorization: `Bearer ${igdbConfig.ACCESSTOKEN}`,
};

/**
 * Get a game information by name
 * @route POST /igdb/searchGame
 * @produces application/json
 * @param {igdbGame.model} igdbGame.body.required - The name of the game
 * @returns {Array.<igdbResultDTO>} 200
 * @returns {Error} 400 - Bad Request
 * @returns {Error} 500 - Internal Server Error
 */
const searchGame = async (req, res) => {
    let results = [];
    let name = req.body.name;

    let reqBody = `fields name, cover; search "${name}";`;

    try {
        await axios
            .post(`${igdbEndpoints.BASEURL}/${igdbEndpoints.GAMES}`, reqBody, {
                headers: { ...headerConfig },
            })
            .then((response) => {
                response.data.map(async (result, index) => {
                    results.push(new igdbResultDTO(result));
                });
                return res.status(200).send(results);
            });
    } catch (err) {
        const errorResponse = err.response.data;

        errorResponse.map((error) => {
            logger.error(`${error.status}: ${error.title} - ${error.cause}`);
        });
        return res.status(400).send(errorResponse);
    }
};

/**
 * Get a game information by name
 * @route POST /igdb/game/{gameid}
 * @produces application/json
 * @param {integer} gameid.path.required - The id of the game
 * @returns {object} 200
 * @returns {Error} 400 - Bad Request
 * @returns {Error} 500 - Internal Server Error
 */
const getGame = async (req, res) => {
    const gameId = req.params.gameid;

    const reqBody = `fields *; where id = ${gameId};`;

    try {
        await axios
            .post(`${igdbEndpoints.BASEURL}/${igdbEndpoints.GAMES}`, reqBody, {
                headers: { ...headerConfig },
            })
            .then((response) => res.status(200).send(response.data[0]));
    } catch (err) {
        logger.error(err);
    }
};

/**
 * Get a game cover art by the image id
 * @route POST /igdb/coverArt/{gameid}
 * @produces string
 * @param {integer} gameid.path.required - the id of the cover art image
 * @returns {String} 200 - url of the cover art
 * @returns {Error} 400 - Bad Request
 * @returns {Error} 500 - Internal Server Error
 */
const getGameCoverArt = async (req, res) => {
    const gameId = req.params.gameid;

    const reqBody = `fields url; where game = ${gameId};`;

    try {
        await axios
            .post(`${igdbEndpoints.BASEURL}/${igdbEndpoints.COVERS}`, reqBody, {
                headers: { ...headerConfig },
            })
            .then((response) => res.status(200).send(response.data));
    } catch (err) {
        logger.error(err);
    }
};

// Helper to get game cover art within service methods
const getGameCoverArtInternal = async (gameId) => {
    const reqBody = `fields url; where game = ${gameId};`;

    try {
        await axios
            .post(`${igdbEndpoints.BASEURL}/${igdbEndpoints.COVERS}`, reqBody, {
                headers: { ...headerConfig },
            })
            .then((response) => res.status(200).send(response.data));
    } catch (err) {
        logger.error(err);
    }
};

module.exports = {
    searchGame,
    getGame,
    getGameCoverArt,
};