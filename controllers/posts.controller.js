import Post from "../models/post.model.js";
import * as postService from "../services/posts.service.js";
import { ErrorBuilder } from "../errors/ErrorBuilder.js";
const errorBuilder = new ErrorBuilder();

export async function getAll(req, res, next) {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const skip = (page - 1) * limit;
    const query = search ? { title: { $regex: search, $options: "i" } } : {};

    const data = await postService.getAll({ query, skip, limit, page });
    return res.status(200).json(data);
  } catch (err) {
    next(err);
  }
}

export async function getPostById(req, res, next) {
  try {
    const post = await postService.getPostById(req.params.id);
    if (!post) {
      return next(errorBuilder.createNotFound("Post not found."));
    }
    return res.status(200).json(post);
  } catch (err) {
    if (err.name === "CastError") {
      throw errorBuilder.createBadRequest("Invalid post ID.");
    }
    next(err);
  }
}

export async function addPost(req, res, next) {

  try {
    const imageUrl = req.file
      ? await postService.uploadToFireBase(req.file)
      : null;
    console.log("image url ====> ", imageUrl);
    const data = {
      author: req.body.author,
      title: req.body.title,
      image: imageUrl ? imageUrl : "errornot saved ",
      content: req.body.content,
      createdBy: req.body.createdBy,
    };
    const post = await postService.addPost(data);
    return res.status(201).json(post);
  } catch (err) {
    next(err);
  }
}

export async function updatePost(req, res, next) {
  try {
    const id = req.params.id;
    const data = req.body;
    if (!data) throw new Error("No data was provided to be edited");
    const newPost = {
      ...data,
    };
    if (req.file) {
      const imageUrl = await postService.uploadToFireBase(req.file);
      newPost.image = imageUrl;
    }
    console.log("Updated post payload:", newPost, "for ID:", id);
    console.log("body of the request'", data, id);
    const updatedPost = await postService.updatePost(id, newPost);

    return res.status(201).json(updatedPost);
  } catch (err) {
    next(err);
  }
}

export async function deletePost(req, res, next) {
  try {
    const id = req.params.id;
    console.log(" controller ", id)
    const message = await postService.deletePost(id);
    if (!message) {
      return next(errorBuilder.createNotFound("Post not found."));
    }
    return res.status(200).json(message);
  } catch (err) {
    next(err);
  }
}
