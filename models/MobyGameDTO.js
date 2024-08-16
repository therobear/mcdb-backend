/**
 * @typedef MobyGameDTO
 * @property {string} title
 * @property {string} description
 * @property {string} coverUrl
 * @property {Array.<MobyPlatform>} platforms
 * @property {Array.<string>} screenshots
 * @property {Array.<object>} genres
 */
module.exports = function MobyGameDTO(game) {
    this.title = game.title;
    this.description = game.description;
    this.coverUrl = game.sample_cover?.image;
    this.thumbnailUrl = game.sample_cover?.thumbnail_url;
    this.platforms = game.platforms;
    this.screenshots = game.screenshots;
    this.genres = game.genres;
};
