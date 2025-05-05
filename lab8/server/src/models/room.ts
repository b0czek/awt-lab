import mongoose, { Schema } from "mongoose";
import { IRoom, RoomDocument } from "../types";

const roomSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<RoomDocument>("Room", roomSchema);
