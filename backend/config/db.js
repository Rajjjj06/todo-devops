import mongoose from "mongoose";
import { configDotenv } from "dotenv";

configDotenv()

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Database connected successfully")
    } catch (error) {
        console.log(error)
    }
}

export default connectDb;