import User from "../models/user.model.js";
import { ErrorBuilder } from "../errors/ErrorBuilder.js";
const errorBuilder = new ErrorBuilder();

export const checkUser = async function (req, res, next) {
  try {
    const { email } = req.body;

    const user = await User.findUserByEmail(email);
    if (!user) {
      throw errorBuilder.createNotFound("User is not in the database");
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
