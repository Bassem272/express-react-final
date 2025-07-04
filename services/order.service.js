import { ErrorBuilder } from "../errors/ErrorBuilder.js";
import Order from "../models/order.model.js";
const errorBuilder = new ErrorBuilder();

export async function getAll({ query, skip, limit, page }) {
  try {
    const orders = await Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));
    const total = await Order.countDocuments(query);
    return {
      orders: orders,
      data: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (err) {
    throw errorBuilder.createInternalServerError("Failed to fetch orders.");
  }
}

export async function getOrderById(id) {
  try {
    const order = await Order.findById(id);
    if (!order) {
      throw errorBuilder.createNotFound("Order not found.");
    }
    return order;
  } catch (err) {
    if (err.name === "CastError") {
      throw errorBuilder.createBadRequest("Invalid order ID.");
    }
    throw err;
  }
}

export async function addOrder(data) {
  try {
    // const exist = await Order.findOne({ title: data.title });

    // if (exist)
    //   throw errorBuilder.createBadRequest(
    //     `"A order with the same title-> ${data.title}  ${exist}  already exists, try another name, please~!"`
    //   );
    const order = new Order(data);
    await order.save();
    return order;
  } catch (err) {
    throw err;
  }
}

export async function updateOrder(id, data) {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(id, data, { new: true });
    if (!updatedOrder) {
      throw errorBuilder.createNotFound("Order to update not found.");
    }
    return updatedOrder;
  } catch (err) {
    throw errorBuilder.createBadRequest("Failed to update order.");
  }
}

export async function deleteOrder(id) {
  try {
    console.log(" service ", id)
    const deleted = await Order.findByIdAndDelete(id);
    if (!deleted) {
      throw errorBuilder.createNotFound("Order to delete not found.");
    }

    return { message: "Order deleted successfully" };
  } catch (err) {
    throw errorBuilder.createBadRequest("Failed to delete order.");
  }
}


