import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import corsOption from "./constant/Cors";
import session from "express-session";
import passport from "passport";
import "./passport/index"
import fs from "fs";
const app = express();

dotenv.config();
app.use(cors(corsOption));

app.use(
  session({
    secret: process.env.EXPRESS_SESSION_SECRET as string,
    resave: true,
    saveUninitialized: true,
  })
);
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use('/uploads', express.static('uploads'));
app.use(cookieParser());

import userRouter from "./routes/User.routes";
import blogRouter from "./routes/blog.routes"
import transcationRouter from "./routes/User.transcation";
import BudgetRouter from "./routes/User.Budget";
import DashboardRouter from "./routes/User.Dashboard";
import GoalRouter from "./routes/User.Goals"
// import { errorHandler } from "./utils/GlobalError";
app.get("/",(req,res)=> res.send("hello"))
app.use("/user", userRouter);
app.use("/blog", blogRouter);
app.use("/transcation", transcationRouter);
app.use("/budget", BudgetRouter);
app.use("/goal", GoalRouter);
app.use("/dashboard", DashboardRouter);
// app.use(errorHandler);

export { app };
