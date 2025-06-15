import express from "express";
import {
  register,
  login,
  renewTokenController,
  logout,
} from "../controllers/user.controller.js";
import { validate } from "../middlewares/ValidateMiddleware.js";
import {
  registerValidation,
  loginValidation,
} from "../validators/user.validator.js";
import { checkUser } from "../middlewares/CheckUserExists.js";
import { check } from "express-validator";
import User from "../models/user.model.js";

const UserRouter = express.Router();

UserRouter.post("/register", registerValidation, validate, register);
UserRouter.post("/login", loginValidation, validate, checkUser, login);

UserRouter.post("/refresh-token", renewTokenController);
UserRouter.post("/logout", logout);

export default UserRouter;
