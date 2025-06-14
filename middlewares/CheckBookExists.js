import Book from "../models/book.model.js";

export async function checkBookExists(id) {
  const book = await Book.findById(id);
  return book;
}
 