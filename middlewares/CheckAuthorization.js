import Book from "../models/book.model.js";
import { ErrorBuilder } from "../errors/ErrorBuilder.js";
import { checkBookExists } from "./CheckBookExists.js";
const errorBuilder = new ErrorBuilder();

export const checkAdmin = (req, res, next) => {
  const user = req.auth;
  if (!user || user.role !== 'admin') {
    console.log("admin middle", user)
    
    return next(errorBuilder.createUnauthorizedError("Only admin can take this action!"));
  }
  next();
};

export const checkOwner = (req, res, next) => {
  const user = req.user;
  const {createdBy} = req.body; 
  if (!user || user._id !== createdBy ) {
    console.log(user)
    
    return next(errorBuilder.createUnauthorizedError("Only owner can take this action!"));
  }
  next();
};

export const checkAdminOrOwner = async (req, res, next) => {
  try {
  const user = req.auth;
  const bookId = req.params.id;
  console.log(user, bookId, req.body , req.method )

    if (!user) {
      return next(errorBuilder.createUnauthorizedError("Unauthorized user!"));
    }

    if (user.role === "admin") {
      return next(); 
    }
    if(req.method === 'POST' ){
      return next()
    }

    const book = await checkBookExists(bookId);
    if (!book) {
      return next(errorBuilder.createNotFound("Book not found!"));
    }
console.log(user.id, book.createdBy.toString() )
    if (book.createdBy.toString() !== user.id) {
      return next(errorBuilder.createUnauthorizedError("Only owner or admin can access this book!"));
    }

    next(); 
  } catch (err) {
    console.log(err);
    next(err);
  }
};