import dotenv from "dotenv";

dotenv.config();

const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/chatapp";

export const config = {
    mongo: {
        url: MONGO_URL,
    },
    server: {
        port: process.env.PORT || 3001,
    },
};
