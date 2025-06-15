import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    title:{type:String, required : true, unique: true },
    author: {type : String , required: true},
    coverImage : {type : String },
    createdBy: {type : mongoose.Schema.Types.ObjectId, ref:"User", required: true},
}, 
{ timestamps: true }
); 

const Book =  mongoose.model("books", bookSchema) 

export default Book; 

