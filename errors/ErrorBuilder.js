import { NotFound, BadRequest, InternalServerError, Unauthorized  } from "./ConcreteErrors.js";

export class ErrorBuilder {
  createNotFound(message) {
    return new NotFound(message);
  }

  createBadRequest(message) {
    return new BadRequest(message);
  }

  createInternalServerError(message) {
    return new InternalServerError(message);
  }

  createUnauthorizedError(message){
    return new Unauthorized(message); 
  }
}
