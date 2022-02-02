export class GameNotJoinableError extends Error {
  constructor(message) {
    super(message);

    Object.setPrototypeOf(this, GameNotJoinableError.prototype);

    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}
