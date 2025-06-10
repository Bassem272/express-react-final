import Book from "../models/book.model.js";
import { ErrorBuilder } from "../errors/ErrorBuilder.js";
const errorBuilder = new ErrorBuilder();

export async function getAll({ query, skip, limit, page }) {
  try {
    const books = await Book.find(query).skip(skip).limit(parseInt(limit));
    const total = await Book.countDocuments(query);
    return {
      books: books,
      data: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (err) {
    throw errorBuilder.createInternalServerError("Failed to fetch books.");
  }
}

export async function getBookById(id) {
  try {
    const book = await Book.findById(id);
    if (!book) {
      throw errorBuilder.createNotFound("Book not found.");
    }
    return book;
  } catch (err) {
    if (err.name === "CastError") {
      throw errorBuilder.createBadRequest("Invalid book ID.");
    }
    throw err;
  }
}

export async function addBook(data) {
  try {
    const book = new Book(data);
    await book.save();
    return book;
  } catch (err) {
    throw errorBuilder.createBadRequest(
      "Failed to add book. Make sure data is valid."
    );
  }
}

export async function updateBook(id, data) {
  try {
    const updatedBook = await Book.findByIdAndUpdate(id, data, { new: true });
    if (!updatedBook) {
      throw errorBuilder.createNotFound("Book to update not found.");
    }
    return updatedBook;
  } catch (err) {
    throw errorBuilder.createBadRequest("Failed to update book.");
  }
}

export async function deleteBook(id) {
  try {
    const deleted = await Book.findByIdAndDelete(id);
    if (!deleted) {
      throw errorBuilder.createNotFound("Book to delete not found.");
    }

    return { message: "Book deleted successfully" };
  } catch (err) {
    throw errorBuilder.createBadRequest("Failed to delete book.");
  }
}
