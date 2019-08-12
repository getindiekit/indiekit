class IndieKitError extends Error {
  constructor(args) {
    super(args);
    this.name = 'IndieKitError';
    this.message = args;
    this.stack = new Error().stack;
    Error.captureStackTrace(this, IndieKitError);
  }
}

module.exports = {
  IndieKitError
};
