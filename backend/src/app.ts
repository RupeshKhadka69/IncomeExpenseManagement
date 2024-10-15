import express from "express";
import dotenv from "dotenv"
import cors from "cors";
import cookieParser from "cookie-parser";
 import corsOption from "./constant/Cors";
const app = express();

dotenv.config();
app.use(cors(corsOption));


app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static("public"))
app.use(cookieParser())

import userRouter from "./routes/User.routes";
import transcationRouter from "./routes/User.transcation";
// import { errorHandler } from "./utils/GlobalError";


app.use("/user",userRouter);
app.use("/transcation",transcationRouter);
// app.use(errorHandler);

export {app}; 