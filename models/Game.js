/**
 * @typedef Game
 * @property {integer} id
 * @property {string} title
 * @property {string} description
 * @property {string} coverUrl
 * @property {Array.<MobyPlatform>}platforms
 * @property {Array.<string>}screenshots
 * @property {Array.<integer>}ownedPlaforms
 */
module.exports = function Game(game) {
    this.Id = game.id;
    this.Title = game.title;
    this.Description = game.description;
    this.CoverUrl = game?.coverUrl;
    this.ThumbnailUrl = game.sample_cover?.thumbnail_url;
    this.AvailablePlaforms = game.platforms;
    this.Screenshots = game.screenshots;
    this.OwnedPlaforms = game.ownedPlatforms;
};
