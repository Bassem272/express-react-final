import { BaseError } from "./BaseError.js";

export class BadRequest extends BaseError {
  constructor(message = "Bad Request") {
    super("BadRequest", 400, message);
  }
}

export class NotFound extends BaseError {
  constructor(message = "Resource Not found") {
    super("NotFound", 404, message);
  }
}

export class InternalServerError extends BaseError {
  constructor(message = "Internal Server Error") {
    super("InternalServerError", 500, message);
  }
}

export class Unauthorized extends BaseError {
  constructor(message = "Unauthorized") {
    super("Unauthorized", 401, message);
  }
}