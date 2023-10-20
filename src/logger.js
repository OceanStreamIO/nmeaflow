const winston = require('winston');

let logger = null;

module.exports.createLogger = function ({logLevel} = {}) {
  logger = winston.createLogger({
    level: process.env.LOG_LEVEL || logLevel || 'debug',
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp(),
      winston.format.printf((info) => {
        let message = info.message;

        // eslint-disable-next-line no-undef
        if (info[Symbol.for('splat')]) {
          // eslint-disable-next-line no-undef
          info[Symbol.for('splat')].forEach((splatItem) => {
            message += ` ${splatItem}`;
          });
        }

        return message;
      })
    ),

    transports: [
      new winston.transports.Console()
    ],
  });

  return logger;
};

module.exports.getLogger = function () {
  return logger || console;
};
