import mongoose, { Schema } from "mongoose";
import { IMessage, MessageDocument } from "../types";

const messageSchema: Schema = new Schema({
    room: { type: String, required: true },
    user: { type: String, required: true },
    text: { type: String },
    image: { type: String },
    timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<MessageDocument>("Message", messageSchema);
