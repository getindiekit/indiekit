export class SetupCancelledError extends Error {
  code = "ERR_SETUP_CANCELLED";

  constructor(message = "Setup cancelled") {
    super(message);
    this.name = "SetupCancelledError";
  }
}
