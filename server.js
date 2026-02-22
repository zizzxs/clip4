import express from 'express';
import cors from 'cors';
import ytdl from '@distube/ytdl-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve the 'public' folder so the React frontend can access downloaded videos
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

app.post('/api/fetch-video', async (req, res) => {
    const { url } = req.body;

    if (!url || !ytdl.validateURL(url)) {
        return res.status(400).json({ error: 'Invalid YouTube URL provided.' });
    }

    try {
        const info = await ytdl.getInfo(url);
        const videoTitle = info.videoDetails.title.replace(/[^\w\s]/gi, '').split(' ').join('_'); // Clean filename
        const videoId = info.videoDetails.videoId;
        const filename = `${videoId}_${videoTitle}.mp4`;
        const clipFilename = `clip_${filename}`;

        const outputPath = path.join(uploadsDir, filename);
        const clipPath = path.join(uploadsDir, clipFilename);

        // If we already downloaded and processed it, return the CLIP immediately
        if (fs.existsSync(clipPath)) {
            console.log(`Clip already exists: ${clipFilename}`);
            return res.json({
                success: true,
                message: 'Video already cached',
                videoUrl: `/uploads/${clipFilename}`,
                title: info.videoDetails.title + " (Highlight)",
                duration: 30, // Default cut duration
                thumbnail: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url
            });
        }

        console.log(`Starting download for: ${info.videoDetails.title}`);

        // If we have the source but not the clip
        const processClip = () => {
            console.log(`Starting FFmpeg processing for: ${filename}`);
            ffmpeg(outputPath)
                .outputOptions([
                    '-ss 00:00:00',      // Start at 0s
                    '-t 30',             // 30 seconds long
                    '-vf crop=ih*9/16:ih' // Crop middle to 9:16 aspect ratio
                ])
                .save(clipPath)
                .on('end', () => {
                    console.log(`FFmpeg processing complete: ${clipFilename}`);
                    res.json({
                        success: true,
                        message: 'Download and Processing complete',
                        videoUrl: `/uploads/${clipFilename}`, // Return the 9:16 CLIP
                        title: info.videoDetails.title + " (Highlight)",
                        duration: 30,
                        thumbnail: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url
                    });
                })
                .on('error', (err) => {
                    console.error('FFmpeg error:', err);
                    res.status(500).json({ error: `FFmpeg processing failed: ${err.message}` });
                });
        };

        if (fs.existsSync(outputPath)) {
            // We have the raw file, just need to process it
            processClip();
        } else {
            // Need to download from YT first
            const videoStream = ytdl(url, { quality: 'highest' });
            const writeStream = fs.createWriteStream(outputPath);

            videoStream.pipe(writeStream);

            writeStream.on('finish', () => {
                console.log(`Download complete: ${filename}`);
                // Now process it into a vertical highlight clip
                processClip();
            });

            writeStream.on('error', (err) => {
                console.error('File write error', err);
                res.status(500).json({ error: 'Error saving video file.' });
            });
        }

    } catch (error) {
        console.error('ytdl error:', error);
        res.status(500).json({ error: `ytdl error: ${error.message}` });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('Ready to receive YouTube URLs for downloading.');
});
