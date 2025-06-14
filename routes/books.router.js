import express from "express";
import {
  addBook,
  getAll,
  getBookById,
  updateBook,
  deleteBook,
} from "../controllers/books.controller.js";
// import upload from "../middlewares/MulterMiddleware.js";
import { checkLogin } from "../middlewares/CheckLoggedIn.js";
import {
  checkAdmin,
  checkOwner,
  checkAdminOrOwner,
} from "../middlewares/CheckAuthorization.js";
import { bookValidation } from "../validators/book.validator.js";
import { validate } from "../middlewares/ValidateMiddleware.js";

const BooksRouter = express.Router();

BooksRouter.use(checkLogin);

BooksRouter.get("/", checkAdmin, getAll);

BooksRouter.get("/:id", checkAdminOrOwner, getBookById);

BooksRouter.post("/", 
  // upload.single("coverImage")
  // , 
  checkAdminOrOwner,
   addBook);

BooksRouter.put("/:id", checkAdminOrOwner, updateBook);

BooksRouter.delete("/:id", checkAdminOrOwner, deleteBook);

export default BooksRouter;
