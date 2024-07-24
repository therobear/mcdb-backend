/**
 * @typedef MobyPlatform
 * @property {string} releaseDate
 * @property {string} platformName;
 */
module.exports = function MobyPlatform(platform) {
    this.releaseDate = platform.first_release_date;
    this.platformName = platform.platform_name;
};
