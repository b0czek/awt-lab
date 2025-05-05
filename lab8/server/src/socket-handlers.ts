import { Server, Socket } from "socket.io";
import Message from "./models/message";
import Room from "./models/room";
import Upload from "./models/upload";
import { IUser, ITypingUser } from "./types";
import path from "path";
import fs from "fs";

export function setupSocketHandlers(io: Server): void {
    const users: Record<string, string> = {};
    const typingUsers: ITypingUser = {};

    io.on("connection", (socket: Socket) => {
        console.log("New client connected:", socket.id);

        socket.on("login", async (username: string) => {
            if (Object.values(users).includes(username)) {
                socket.emit("login_error", "Username is already taken");
                return;
            }

            users[socket.id] = username;
            socket.emit("login_success", username);

            const rooms = await Room.find().sort("name");
            socket.emit("room_list", rooms);
        });

        socket.on("join_room", async (roomName: string) => {
            Array.from(socket.rooms)
                .filter((r) => r !== socket.id)
                .forEach((r) => {
                    socket.leave(r);
                    socket.to(r).emit("user_left", users[socket.id]);
                });

            socket.join(roomName);
            socket.to(roomName).emit("user_joined", users[socket.id]);

            const messages = await Message.find({ room: roomName })
                .sort("timestamp")
                .limit(50);

            socket.emit("message_history", messages);
        });

        socket.on(
            "send_message",
            async (data: { room: string; text: string }) => {
                const { room, text } = data;
                const user = users[socket.id];

                if (!user) return;

                const message = new Message({
                    room,
                    user,
                    text,
                    timestamp: new Date(),
                });

                await message.save();

                io.to(room).emit("new_message", {
                    _id: message._id,
                    user,
                    text,
                    timestamp: message.timestamp,
                });
            }
        );

        socket.on(
            "send_image",
            async (data: { room: string; imagePath: string }) => {
                const { room, imagePath } = data;
                const user = users[socket.id];

                if (!user) return;

                const message = new Message({
                    room,
                    user,
                    image: imagePath,
                    timestamp: new Date(),
                });

                await message.save();

                // Mark the image as used so it won't be deleted by cleanup
                try {
                    const filename = path.basename(imagePath);
                    await Upload.findOneAndUpdate(
                        { path: imagePath },
                        { used: true }
                    );
                    console.log(`Image marked as used: ${filename}`);
                } catch (error) {
                    console.error("Error marking image as used:", error);
                }

                io.to(room).emit("new_image", {
                    _id: message._id,
                    user,
                    image: imagePath,
                    timestamp: message.timestamp,
                });
            }
        );

        socket.on("typing", (room: string) => {
            const user = users[socket.id];

            if (!user) return;

            if (!typingUsers[room]) {
                typingUsers[room] = [];
            }

            if (!typingUsers[room].includes(user)) {
                typingUsers[room].push(user);
            }

            socket.to(room).emit("typing_status", typingUsers[room]);

            setTimeout(() => {
                if (typingUsers[room]) {
                    const index = typingUsers[room].indexOf(user);
                    if (index !== -1) {
                        typingUsers[room].splice(index, 1);
                        socket
                            .to(room)
                            .emit("typing_status", typingUsers[room]);
                    }
                }
            }, 3000);
        });

        socket.on("create_room", async (roomName: string) => {
            const existingRoom = await Room.findOne({ name: roomName });

            if (existingRoom) {
                socket.emit("room_error", "Room with this name already exists");
                return;
            }

            const newRoom = new Room({ name: roomName, createdAt: new Date() });
            await newRoom.save();

            io.emit("new_room", newRoom);
        });

        socket.on("delete_room", async (roomName: string) => {
            try {
                const messagesWithImages = await Message.find({
                    room: roomName,
                    image: { $exists: true, $ne: null },
                });

                if (messagesWithImages.length > 0) {
                    console.log(
                        `Found ${messagesWithImages.length} images to clean up in room ${roomName}`
                    );

                    const imagePaths = messagesWithImages
                        .map((msg) => msg.image)
                        .filter(Boolean);

                    // Mark all these uploads as unused
                    for (const imagePath of imagePaths) {
                        if (imagePath) {
                            await Upload.findOneAndUpdate(
                                { path: imagePath },
                                { used: false }
                            );
                        }
                    }

                    console.log(
                        `Marked ${imagePaths.length} uploads as unused for cleanup`
                    );
                }

                await Room.deleteOne({ name: roomName });

                await Message.deleteMany({ room: roomName });

                io.emit("room_deleted", roomName);

                const socketsInRoom = await io.in(roomName).fetchSockets();
                for (const s of socketsInRoom) {
                    s.emit("current_room_deleted");
                    s.leave(roomName);
                }

                console.log(`Room ${roomName} deleted`);
            } catch (error) {
                console.error("Error deleting room:", error);
                socket.emit(
                    "room_error",
                    "There was an error deleting the room"
                );
            }
        });

        socket.on("disconnect", () => {
            const user = users[socket.id];

            if (user) {
                Array.from(socket.rooms)
                    .filter((r) => r !== socket.id)
                    .forEach((r) => {
                        socket.to(r).emit("user_left", user);
                    });

                Object.keys(typingUsers).forEach((room) => {
                    const index = typingUsers[room]?.indexOf(user) ?? -1;
                    if (index !== -1) {
                        typingUsers[room].splice(index, 1);
                        io.to(room).emit("typing_status", typingUsers[room]);
                    }
                });

                delete users[socket.id];
            }

            console.log("Client disconnected:", socket.id);
        });
    });
}
