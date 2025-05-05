import fs from "fs";
import path from "path";
import Upload from "../models/upload";

// How long unused images stay in the system before being deleted (in milliseconds)
const IMAGE_PURGATORY_TIME = 24 * 60 * 60 * 1000; // 24 hours by default

export async function cleanupUnusedImages(): Promise<void> {
    try {
        const cutoffDate = new Date(Date.now() - IMAGE_PURGATORY_TIME);

        // Find unused images that are older than the cutoff time
        const unusedUploads = await Upload.find({
            used: false,
            uploadedAt: { $lt: cutoffDate },
        });

        if (unusedUploads.length > 0) {
            console.log(
                `Found ${unusedUploads.length} unused images to delete`
            );

            for (const upload of unusedUploads) {
                const filePath = path.join(
                    __dirname,
                    "../../uploads",
                    path.basename(upload.filename)
                );

                // Delete the file from the filesystem
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                    console.log(`Deleted unused file: ${upload.filename}`);
                }

                // Remove the record from the database
                await Upload.deleteOne({ _id: upload._id });
            }

            console.log(
                `Cleanup complete. Removed ${unusedUploads.length} unused images.`
            );
        }
    } catch (error) {
        console.error("Error during image cleanup:", error);
    }
}
