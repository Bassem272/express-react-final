import express from "express";
import {
  register,
  login,
  renewTokenController,
  logout,
  updateUser,
  syncUser
} from "../controllers/user.controller.js";
import { validate } from "../middlewares/ValidateMiddleware.js";
import {
  registerValidation,
  loginValidation,
} from "../validators/user.validator.js";
import { checkUser } from "../middlewares/CheckUserExists.js";
import { check } from "express-validator";
import User from "../models/user.model.js";
import { checkLogin } from "../middlewares/CheckLoggedIn.js";
const UserRouter = express.Router();

UserRouter.post("/register", registerValidation, validate, register);
UserRouter.post("/login", loginValidation, validate, checkUser, login);
UserRouter.put("/update/:id",checkLogin , updateUser);

UserRouter.post("/refresh-token", renewTokenController);
UserRouter.post("/logout", logout);

// New OAuth sync route
UserRouter.post("/sync-user", 
  [
    check("email").isEmail(),
    check("accessToken").notEmpty()
  ],
  validate,
  syncUser
)

export default UserRouter;
