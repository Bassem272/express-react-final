export class BaseError extends Error {
  constructor(name , status, message) {
    super(message);
    this.status = status;
    this.name = name; 
    Error.captureStackTrace(this, this.constructor);
  }
}

