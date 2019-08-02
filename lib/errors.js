const logger = require(process.env.PWD + '/lib/logger');

class IndieKitError extends Error {
  constructor(args) {
    super(args);
    this.name = 'IndieKitError';
    this.message = args;
    this.stack = new Error().stack;
    Error.captureStackTrace(this, IndieKitError);
    logger.error(args);
  }
}

module.exports = {
  IndieKitError
};
