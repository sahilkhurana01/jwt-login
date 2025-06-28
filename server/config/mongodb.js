import mongoose from "mongoose";

const connectDB = async () =>{
    const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017";
    
    mongoose.connection.on('connected',()=>console.log("Database Connected"));

    try {
        await mongoose.connect(`${mongoURI}/mern-auth`);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.log("MongoDB connection error:", error.message);
        console.log("Please make sure MongoDB is running or set MONGODB_URI in .env file");
    }
};

export default connectDB;