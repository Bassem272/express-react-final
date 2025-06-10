import { body } from "express-validator";

export const postValidation = [
  body("title")
    .notEmpty()
    .withMessage("Must not be empty")
    .isLength({ min: 3 })
    .withMessage("length must be at least 3 chars"),
  body("author")
    .notEmpty()
    .withMessage("Must not be empty")
    .isLength({ min: 6 })
    .withMessage("length must be at least 3 chars"),
  ,
  body("content")
    .notEmpty()
    .withMessage("Must not be empty")
    .isLength({ min: 100 })
    .withMessage("Content must be at least 100 chars"),
  ,
  body("createdBy")
    .notEmpty()
    .withMessage("createdBy is required")
    .isMongoId()
    .withMessage("createdBy must be a valid Mongo ID"),
];
