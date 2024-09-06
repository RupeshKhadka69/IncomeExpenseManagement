import { app } from "./app";
import connectDb from "./db";
import dotenv from "dotenv"

dotenv.config({
    path: './.env'
})

connectDb().then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})
  