import Order from "../models/order.model.js";
import * as orderService from "../services/order.service.js";
import { ErrorBuilder } from "../errors/ErrorBuilder.js";
const errorBuilder = new ErrorBuilder();

export async function getAll(req, res, next) {
  try {
    const {id }= req.auth; 
    if(!id) throw new Error("No id was provided to be deleted as he didn't log in");
    const { page = 1, limit = 10, search = "" } = req.query;
    const skip = (page - 1) * limit;
    const query = search ? { title: { $regex: search, $options: "i" } } : {};

    const data = await orderService.getAll({ query, skip, limit, page });
    return res.status(200).json(data);
  } catch (err) {
    next(err);
  }
}

export async function getOrderById(req, res, next) {
  try {
    const order = await orderService.getOrderById(req.params.id);
    if (!order) {
      return next(errorBuilder.createNotFound("Order not found."));
    }
    return res.status(200).json(order);
  } catch (err) {
    if (err.name === "CastError") {
      throw errorBuilder.createBadRequest("Invalid Order ID.");
    }
    next(err);
  }
}

// const OrderSchema = new mongoose.Schema({
//     user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
//     orderItems: [
//         {
//             name: {type: String, required: true},
//             quantity: {type: Number, required: true},
//             image: {type: String},
//             price: {type: Number, required: true},
//             product: {type: String, required: true},
//         }
//     ],
//     totalCost: {type:Number}
// }); 
export async function addOrder(req, res, next) {
  try {
if (!req.body) throw new Error("No data was provided to be added");
console.log("body of the request in add order", req.body);
    const data = {
      user: req.body.user,
      orderItems: req.body.orderItems,
      totalCost: req.body.totalCost,
    };
    const order = await orderService.addOrder(data);
    return res.status(201).json(order);
  } catch (err) {
    next(err);
  }
}

export async function updateOrder(req, res, next) {
  try {
    const id = req.params.id;
    if (!req.body) throw new Error("No data was provided to be edited");
    const data = req.body;
    if (!data) throw new Error("No data was provided to be edited");
    const newOrder = {
      ...data,
    };
  
    console.log("Updated Order payload:", newOrder, "for ID:", id);
    console.log("body of the request'", data, id);
    const updatedOrder = await orderService.updateOrder(id, newOrder);

    return res.status(201).json(updatedOrder);
  } catch (err) {
    next(err);
  }
}

export async function deleteOrder(req, res, next) {
  try {
    const id = req.params.id;
    if (!id) throw new Error("No id was provided to be deleted");
    console.log(" controller ", id);
    const message = await orderService.deleteOrder(id);
    if (!message) {
      return next(errorBuilder.createNotFound("Order not found."));
    }
    return res.status(200).json(message);
  } catch (err) {
    next(err);
  }
}
