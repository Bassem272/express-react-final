import express, { urlencoded } from "express"; 
import mongoDB from "./db/mongo.connection.js"; 
import { LoggerMiddleware } from "./middlewares/LoggerMiddleware.js";
import BooksRouter from "./routes/books.router.js"; 
import UserRouter from "./routes/user.routes.js";
import morgan from "morgan";
import { GlobalErrorHandler } from "./middlewares/ErrorMiddleware.js";
import dotenv from "dotenv";
import PostsRouter from "./routes/posts.router.js";
import cors from "cors"
import { logga } from "./services/firebaseConfig.js";
logga(); 
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

server.use("/auth", UserRouter); 
server.use("/books", BooksRouter); 
server.use("/posts", PostsRouter); 

server.listen(port , ()=> {
    console.log(`The server is running on port ${port}`); 
}); 

server.use(GlobalErrorHandler)