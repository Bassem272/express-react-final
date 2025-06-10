import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title:{type:String, required : true, unique: true },
    content:{type:String, required: true},
    author: {type : String , required: true},
    image : {type : String },
    createdBy: {type : mongoose.Schema.Types.ObjectId, ref:"User", required: true},
    status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
  },
  likesCount: {
    type: Number,
    default: 0,
  },
  commentsCount: {
    type: Number,
    default: 0,
  }
}, 
  // bonus --> 3
{ timestamps: true }
); 

const Post =  mongoose.model("posts", postSchema) 

export default Post; 

