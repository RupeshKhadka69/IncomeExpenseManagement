import mongoose from "mongoose";

const connectDb = async ()=> {
    try{
        const connection = await mongoose.connect(`${process.env.MONGO_URI as string}/MyDb`);
        console.log("mongodb connected");

    }catch(err){
        console.log("mongodb connection error",err);
        process.exit(1);
    }
}

export default connectDb;