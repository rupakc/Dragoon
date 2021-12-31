const winston = require('winston');
var constants = require('../../config/constants');

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({ json: false, timestamp: true }),
    new winston.transports.File({ filename: constants.logFolderPath + 'combined.log', json: false })
  ],
  exceptionHandlers: [
    new (winston.transports.Console)({ json: false, timestamp: true }),
    new winston.transports.File({ filename: constants.logFolderPath + 'exceptions.log', json: false })
  ],
  exitOnError: false
});

module.exports = {logger};
