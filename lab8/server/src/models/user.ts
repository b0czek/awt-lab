import mongoose, { Schema } from "mongoose";
import { IUser, UserDocument } from "../types";

const userSchema: Schema = new Schema({
    socketId: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    currentRoom: { type: String },
    isOnline: { type: Boolean, default: true },
    lastActive: { type: Date, default: Date.now },
});

export default mongoose.model<UserDocument>("User", userSchema);
