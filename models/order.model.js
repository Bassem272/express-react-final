
import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    user: {type: String , required: true},
    orderItems: [
        {
            name: {type: String, required: true},
            quantity: {type: Number, required: true},
            image: {type: String},
            price: {type: Number, required: true},
            product: {type: Number , required: true},
        }
    ],
    totalCost: {type:Number}
}, 

{ timestamps: true }); 
 const Order = mongoose.model("Order", OrderSchema) 
 export default Order; 