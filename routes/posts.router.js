import express from "express";
import {
  addPost,
  getAll,
  getPostById,
  updatePost,
  deletePost,
} from "../controllers/posts.controller.js";
import upload from "../middlewares/MulterMiddleware.js";
import { checkLogin } from "../middlewares/CheckLoggedIn.js";
import { checkAdmin , checkOwner, checkAdminOrOwner} from "../middlewares/CheckAuthorization.js";
import {postValidation} from "../validators/post.validator.js"
import { validate } from "../middlewares/ValidateMiddleware.js";

const PostsRouter = express.Router();

PostsRouter.use(checkLogin);

PostsRouter.get("/", checkAdmin, getAll);

PostsRouter.get("/:id", checkAdminOrOwner, getPostById);

// PostsRouter.post("/", postValidation , validate ,upload.single("image"),checkAdminOrOwner,  addPost);
PostsRouter.post(
  "/",
  // checkAdminOrOwner,     // 🔐 Authentication/Authorization comes first
  upload.single("image"), // 📤 File handling comes after
  postValidation,
  validate,
  addPost
);
PostsRouter.put("/:id",checkAdminOrOwner, updatePost);

PostsRouter.delete("/:id", checkAdminOrOwner,deletePost);

export default PostsRouter;
