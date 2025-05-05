import { Document, Types } from "mongoose";

export interface IUser {
    socketId: string;
    username: string;
    currentRoom?: string;
    isOnline: boolean;
    lastActive: Date;
}

export interface IMessage {
    room: string;
    user: string;
    text?: string;
    image?: string;
    timestamp: Date;
}

export interface IRoom {
    name: string;
    createdAt: Date;
}

export interface IUpload {
    filename: string;
    path: string;
    uploadedAt: Date;
    used: boolean;
}

export type UserDocument = Document<Types.ObjectId> & IUser;
export type MessageDocument = Document<Types.ObjectId> & IMessage;
export type RoomDocument = Document<Types.ObjectId> & IRoom;
export type UploadDocument = Document<Types.ObjectId> & IUpload;

export interface ITypingUser {
    [room: string]: string[];
}
