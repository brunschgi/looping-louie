var env = process.env.NODE_ENV || 'defaults',
    cfg = require('./config.'+env);

module.exports = cfg;