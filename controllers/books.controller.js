import Book from "../models/book.model.js";
import * as bookService from "../services/books.service.js";
import { ErrorBuilder } from "../errors/ErrorBuilder.js";
const errorBuilder = new ErrorBuilder();

export async function getAll(req, res, next) {
  try {
    // bonus --> 2
    const {page = 1, limit = 10, search = ""}  = req.query
    const skip = (page - 1) * limit; 
    const query = search? {title:{$regex:search, $options: "i"}}:{}; 

    const data = await bookService.getAll({query, skip, limit, page});
    return res.status(200).json(data);
  } catch (err) {
    next(err);
  }
}; 

export async function getBookById(req, res, next) {
  try {
    const book = await bookService.getBookById(req.params.id);
       if (!book) {
      return next(errorBuilder.createNotFound("Book not found."));
    }
    return res.status(200).json(book);
  } catch (err) {
    if (err.name === "CastError") {
      throw errorBuilder.createBadRequest("Invalid book ID.");
    }
    next(err);
  }
}

export async function addBook(req, res, next) {

  try {
    const data = {
      author: req.body.author,
      title: req.body.title,
      coverImage: req.file ? req.file.path : undefined,
      createdBy: req.body.createdBy 
    };
    const book = await bookService.addBook(data);
    return res.status(201).json(book);
  } catch (err) {
    next(err);
  }
}

export async function updateBook(req, res, next) { 
  try {
    const id = req.params.id;
    const data = req.body; 
    const updatedBook = await bookService.updateBook(id, data);

    return res.status(201).json(updatedBook);
  } catch (err) {
    next(err);
  }
}

export async function deleteBook(req, res, next) {
  try {
    const id = req.params.id;
    const message = await bookService.deleteBook(id);
      if (!message) {
      return next(errorBuilder.createNotFound("Book not found."));
    }
    return res.status(200).json(message);
  } catch (err) {
    next(err);
  }
}
