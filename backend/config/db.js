import mongoose from "mongoose";

const connectDB = async()=>{
    try{
        const connection = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB Connected:${connection.connection.host}`);
    }catch{
        console.error("MongoDB connection failed; check the URI and network access.");
        process.exit(1)
    }
}

export default connectDB;