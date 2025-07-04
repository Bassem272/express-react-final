import express from "express";
import {
  addOrder,
  getAll,
  getOrderById,
  updateOrder,
  deleteOrder,
} from "../controllers/orders.controller.js";
import { checkLogin } from "../middlewares/CheckLoggedIn.js";
import {
  checkAdmin,
  checkOwner,
  checkAdminOrOwner,
} from "../middlewares/CheckAuthorization.js";
import { orderValidation } from "../validators/order.validator.js";
import { validate } from "../middlewares/ValidateMiddleware.js";
// import upload from "../middlewares/MulterMiddleware.js";
import multer from "multer";
import {
  uploadWithFile,
  uploadNoFile,
} from "../middlewares/MulterMiddleware.js";

// const upload = multer();

const OrdersRouter = express.Router();
OrdersRouter.use(checkLogin);

OrdersRouter.get("/", getAll);

OrdersRouter.use(checkLogin);
OrdersRouter.get("/:id", getOrderById);

OrdersRouter.post(
  "/",
  orderValidation,
  validate,
  addOrder
);
OrdersRouter.put("/:id", uploadWithFile.single("image"), updateOrder);

OrdersRouter.delete("/:id", deleteOrder);

export default OrdersRouter;
