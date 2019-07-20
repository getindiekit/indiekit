const {createLogger, format, transports} = require('winston');
const {Timber} = require('@timberio/node');
const {TimberTransport} = require('@timberio/winston');

const config = require(process.env.PWD + '/app/config');

let level;
let silent;
switch (process.env.NODE_ENV) {
  case 'production':
    level = 'warning';
    silent = false;
    break;
  case 'test':
    level = 'error';
    silent = true;
    break;
  default:
    level = 'debug';
    silent = false;
    break;
}

const logger = new createLogger({ // eslint-disable-line new-cap
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.errors({
      stack: true
    }),
    format.splat(),
    format.json()
  ),
  defaultMeta: {
    service: config.name
  },
  transports: [
    new transports.Console({
      level,
      silent,
      handleExceptions: true,
      format: format.combine(
        format.colorize(),
        format.printf(
          info => `${info.level}: ${info.message}`,
        ),
      )
    })
  ]
});

// Log to Timber if API key provided
if (config.timber.token) {
  const timber = new Timber(config.timber.token, config.timber.source);
  logger.add(new TimberTransport(timber));
}

module.exports = logger;
