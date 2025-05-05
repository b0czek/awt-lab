export interface IUser {
    id: string;
    username: string;
}

export interface IMessage {
    _id?: string;
    room: string;
    user: string;
    text?: string;
    image?: string;
    timestamp: Date;
}

export interface IRoom {
    _id?: string;
    name: string;
    createdAt: Date;
}
