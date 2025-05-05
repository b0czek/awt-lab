import mongoose from "mongoose";
import { config } from "./config/config";

const options = {
    autoIndex: true,
};

export const connectToDatabase = async (): Promise<void> => {
    try {
        await mongoose.connect(config.mongo.url, options);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

mongoose.connection.on("connected", () => {
    console.log("MongoDB connection established");
});

mongoose.connection.on("error", (err) => {
    console.error(`MongoDB connection error: ${err}`);
});

mongoose.connection.on("disconnected", () => {
    console.log("MongoDB connection disconnected");
});

process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("MongoDB connection closed due to app termination");
    process.exit(0);
});
