import ytdl from '@distube/ytdl-core';
import fs from 'fs';

const url = 'https://www.youtube.com/watch?v=jNQXAC9IVRw';
ytdl.getInfo(url).then(info => {
    console.log('Got info:', info.videoDetails.title);
    const stream = ytdl(url, { quality: 'highest' });
    stream.pipe(fs.createWriteStream('test.mp4'));
    stream.on('end', () => console.log('Download complete'));
    stream.on('error', err => console.error('Stream error:', err));
}).catch(err => console.error('Info error:', err));
