/**
 * @typedef Platform
 * @property {integer} id
 * @property {string} name
 */
module.exports = function Platform(platform) {
    this.Id = platform.id;
    this.Name = platform.platform_name;
};
