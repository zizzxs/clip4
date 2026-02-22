import express from 'express';
import cors from 'cors';
import youtubedl from 'youtube-dl-exec';
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

    if (!url || !url.startsWith('http')) {
        return res.status(400).json({ error: 'Invalid URL provided.' });
    }

    try {
        const info = await youtubedl(url, {
            dumpSingleJson: true,
            noCheckCertificates: true,
            noWarnings: true,
            preferFreeFormats: true,
            ffmpegLocation: ffmpegInstaller.path,
            addHeader: [
                'referer:youtube.com',
                'user-agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36'
            ]
        });

        const videoTitle = info.title.replace(/[^\w\s]/gi, '').split(' ').join('_'); // Clean filename
        const videoId = info.id;
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
                title: info.title + " (Highlight)",
                duration: 30, // Default cut duration
                thumbnail: info.thumbnail
            });
        }

        console.log(`Starting download for: ${info.title}`);

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
                        title: info.title + " (Highlight)",
                        duration: 30,
                        thumbnail: info.thumbnail
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
            await youtubedl(url, {
                output: outputPath,
                format: 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
                mergeOutputFormat: 'mp4',
                ffmpegLocation: ffmpegInstaller.path,
                noCheckCertificates: true,
                noWarnings: true,
                preferFreeFormats: true,
                addHeader: [
                    'referer:youtube.com',
                    'user-agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36'
                ]
            });

            console.log(`Download complete: ${filename}`);
            // Now process it into a vertical highlight clip
            processClip();
        }

    } catch (error) {
        console.error('youtube-dl error:', error);
        res.status(500).json({ error: `youtube-dl error: ${error.message}` });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('Ready to receive YouTube URLs for downloading.');
});
