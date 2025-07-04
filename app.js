import express, { urlencoded } from "express"; 
import mongoDB from "./db/mongo.connection.js"; 
import { LoggerMiddleware } from "./middlewares/LoggerMiddleware.js";
import BooksRouter from "./routes/books.router.js"; 
import UserRouter from "./routes/user.routes.js";
import morgan from "morgan";
import { GlobalErrorHandler } from "./middlewares/ErrorMiddleware.js";
import dotenv from "dotenv";
import PostsRouter from "./routes/posts.router.js";
import ordersRouter from "./routes/order.router.js";
import cors from "cors"
import mongoose from "mongoose";

dotenv.config(); 
const port = process.env.PORT; 
  
const server = express(); 

server.use(cors()) 
server.use(express.json()); 
server.use(express.urlencoded({extended: true})); 
server.use("/uploads", express.static("uploads"));

server.use(LoggerMiddleware); 
server.use(morgan("dev")); 

mongoDB.connect() 

// log the status of the mongo db
mongoose.set('debug', function (collectionName, method, query, doc, options) {
  console.log(`[Mongoose Debug] ${collectionName}.${method}`, JSON.stringify(query), doc, options);
});

server.get("/", (req, res) => {
  res.send("Backend is working ✅");
});

server.use("/auth", UserRouter); 
server.use("/books", BooksRouter); 
server.use("/posts", PostsRouter);
server.use("/orders", ordersRouter); 


server.listen(port , ()=> {
    console.log(`The server is running on port ${port}`); 
}); 

server.use(GlobalErrorHandler)