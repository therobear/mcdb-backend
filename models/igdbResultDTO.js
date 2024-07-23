/**
 * @typedef igdbResultDTO
 * @property {integer} id
 * @property {string} name
 * @property {string} coverUrl
 */
module.exports = function igdbResultDTO(result) {
    this.id = result.id;
    this.name = result.name;
    this.cover = result.cover;
};
