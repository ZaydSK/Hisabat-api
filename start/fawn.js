const Fawn = require('fawn');
const config = require("config");

Fawn.init(process.env.MONGODB_URI);

module.exports = Fawn;