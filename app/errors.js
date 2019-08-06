class IndieKitError extends Error {
  constructor(message) {
    super(message);
    this.name = 'IndieKitError';
    this.message = message;
  }

  toJSON() {
    return {
      error: {
        name: this.name,
        message: this.message,
        stacktrace: this.stack
      }
    };
  }
}

module.exports = {
  IndieKitError
};
