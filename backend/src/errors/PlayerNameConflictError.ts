export class PlayerNameConflictError extends Error {
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, PlayerNameConflictError.prototype);

    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}
