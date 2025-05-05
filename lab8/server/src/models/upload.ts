import mongoose, { Schema } from "mongoose";
import { IUpload, UploadDocument } from "../types";

const uploadSchema: Schema = new Schema({
    filename: { type: String, required: true, unique: true },
    path: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
    used: { type: Boolean, default: false },
});

export default mongoose.model<UploadDocument>("Upload", uploadSchema);
