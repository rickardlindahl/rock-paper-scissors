export class MoveForbiddenError extends Error {
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, MoveForbiddenError.prototype);

    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}
