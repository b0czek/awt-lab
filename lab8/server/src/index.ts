import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import path from "path";
import { connectToDatabase } from "./database";
import { setupSocketHandlers } from "./socket-handlers";
import { config } from "./config/config";
import { upload } from "./config/upload";
import Upload from "./models/upload";
import { cleanupUnusedImages } from "./utils/cleanup";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.post("/upload", upload.single("image"), async (req, res) => {
    if (!req.file) {
        res.status(400).json({ error: "No file" });
        return;
    }

    const filePath = `/uploads/${req.file.filename}`;

    // Track the uploaded file in the database
    try {
        const uploadRecord = new Upload({
            filename: req.file.filename,
            path: filePath,
            uploadedAt: new Date(),
            used: false,
        });

        await uploadRecord.save();
        console.log(`Image uploaded and tracked: ${req.file.filename}`);
    } catch (error) {
        console.error("Error tracking uploaded file:", error);
    }

    res.json({ filePath });
});

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

const CLEANUP_INTERVAL = 60 * 60 * 1000;

connectToDatabase()
    .then(() => {
        setupSocketHandlers(io);

        // Start the cleanup scheduler
        setInterval(cleanupUnusedImages, CLEANUP_INTERVAL);
        console.log("Image cleanup scheduler started - running every hour");

        const PORT = config.server.port;
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Failed to connect to database:", error);
    });
