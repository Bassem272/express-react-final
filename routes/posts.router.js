import express from "express";
import {
  addPost,
  getAll,
  getPostById,
  updatePost,
  deletePost,
} from "../controllers/posts.controller.js";
import { checkLogin } from "../middlewares/CheckLoggedIn.js";
import {
  checkAdmin,
  checkOwner,
  checkAdminOrOwner,
} from "../middlewares/CheckAuthorization.js";
import { postValidation } from "../validators/post.validator.js";
import { validate } from "../middlewares/ValidateMiddleware.js";
// import upload from "../middlewares/MulterMiddleware.js";
import multer from "multer";
import {
  uploadWithFile,
  uploadNoFile,
} from "../middlewares/MulterMiddleware.js";

// const upload = multer();

const PostsRouter = express.Router();

PostsRouter.get("/", getAll);

PostsRouter.use(checkLogin);
PostsRouter.get("/:id", getPostById);

PostsRouter.post(
  "/",
  uploadWithFile.single("image"),
  postValidation,
  validate,
  addPost
);
PostsRouter.put("/:id", uploadWithFile.single("image"), updatePost);

PostsRouter.delete("/:id", deletePost);

export default PostsRouter;
