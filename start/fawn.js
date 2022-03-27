const Fawn = require('fawn');
const config = require("config");

Fawn.init(config.get('dbConnectionString'));

module.exports = Fawn;