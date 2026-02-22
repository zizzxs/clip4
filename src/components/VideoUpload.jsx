import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import './VideoUpload.css';

const MOCK_CLIPS = [
    {
        id: 1,
        title: "The Ultimate Success Secret 🚀",
        duration: "0:45",
        resolution: "2160p (4K)",
        score: 98,
        tags: ["Motivation", "Mindset"],
        image: "https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&q=80&w=600",
    },
    {
        id: 2,
        title: "How to Build Wealth Fast 💰",
        duration: "0:30",
        resolution: "2160p (4K)",
        score: 95,
        tags: ["Finance", "Advice"],
        image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=600",
    },
    {
        id: 3,
        title: "Change Your Life in 6 Months",
        duration: "0:59",
        resolution: "1080p",
        score: 89,
        tags: ["Lifestyle"],
        image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&q=80&w=600",
    },
    {
        id: 4,
        title: "Stop Wasting Your Time 🛑",
        duration: "0:40",
        resolution: "2160p (4K)",
        score: 92,
        tags: ["Productivity", "Focus"],
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600",
    },
    {
        id: 5,
        title: "Morning Routine of Billionaires ☕",
        duration: "0:50",
        resolution: "2160p (4K)",
        score: 96,
        tags: ["MorningRoutine", "Success"],
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600",
    }
];

const VideoUpload = () => {
    const { addClips } = useContext(AppContext);
    const [dragActive, setDragActive] = useState(false);
    const [status, setStatus] = useState('idle'); // idle | uploading | analyzing | complete
    const [progress, setProgress] = useState(0);
    const [urlInput, setUrlInput] = useState('');

    const simulateProcess = () => {
        setStatus('uploading');
        let p = 0;
        const interval = setInterval(() => {
            p += 5;
            setProgress(p);
            if (p === 50) {
                setStatus('analyzing');
            }
            if (p >= 100) {
                clearInterval(interval);
                setStatus('complete');
                addClips(MOCK_CLIPS);
            }
        }, 150);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            simulateProcess();
        }
    };

    const handleUrlSubmit = async (e) => {
        e.preventDefault();
        if (urlInput.trim()) {
            setStatus('uploading');
            setProgress(10);
            try {
                const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
                const response = await fetch(`${API_BASE_URL}/api/fetch-video`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: urlInput })
                });

                setProgress(50);
                setStatus('analyzing');

                const data = await response.json();

                if (data.success) {
                    setProgress(100);
                    setStatus('complete');

                    // Replace the first mock clip with our REAL downloaded video
                    const updatedClips = [...MOCK_CLIPS];
                    updatedClips[0] = {
                        ...updatedClips[0],
                        title: data.title,
                        image: data.thumbnail || updatedClips[0].image,
                        duration: Math.floor(data.duration / 60) + ":" + (data.duration % 60).toString().padStart(2, '0'),
                        realVideoUrl: `${API_BASE_URL}${data.videoUrl}` // Pass the actual local file URL!
                    };
                    addClips(updatedClips);
                } else {
                    alert('Error: ' + data.error);
                    setStatus('idle');
                }

            } catch (err) {
                console.error(err);
                alert('Could not connect to the Backend Server. Is it running?');
                setStatus('idle');
            }
        }
    };

    return (
        <div className="upload-studio animate-fade-in">
            <div className="studio-header mb-4">
                <h1>Transform Long Videos into Viral 4K Clips</h1>
                <p className="text-secondary">AI automatically finds the best moments and formats them for TikTok, Reels, & Shorts.</p>
            </div>

            {status === 'idle' && (
                <div className="upload-options-container">
                    <form className="url-input-form glass-panel mb-4" onSubmit={handleUrlSubmit}>
                        <div className="url-input-wrapper">
                            <span className="link-icon">🔗</span>
                            <input
                                type="url"
                                placeholder="Paste YouTube, TikTok, or Instagram link here..."
                                value={urlInput}
                                onChange={(e) => setUrlInput(e.target.value)}
                                required
                            />
                            <button type="submit" className="btn-primary fetch-btn">Fetch Video</button>
                        </div>
                        <div className="supported-platforms">
                            Supported: <span>YouTube</span> <span>TikTok</span> <span>Instagram</span>
                        </div>
                    </form>

                    <div className="divider mb-4"><span>OR UPLOAD FILE</span></div>

                    <div
                        className={`drop-zone glass-panel ${dragActive ? 'active' : ''}`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <div className="upload-icon">📹</div>
                        <h2>Drag & Drop your video here</h2>
                        <p>Supports MP4, MOV up to 10GB. Automatically upscales to 2160p.</p>
                        <button className="btn-glass mt-4" onClick={simulateProcess}>
                            Browse Files
                        </button>
                    </div>
                </div>
            )}

            {(status === 'uploading' || status === 'analyzing') && (
                <div className="processing-state glass-panel">
                    <div className="spinner-ring"></div>
                    <h2>
                        {status === 'uploading' ? 'Fetching Video...' : 'AI Analyzing for Viral Moments...'}
                    </h2>
                    <p className="text-gradient">
                        {status === 'analyzing' ? 'Finding hooks, reframing subjects, upscaling to 4K...' : `Downloading source video at high speed...`}
                    </p>

                    <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
                    </div>
                    <p className="progress-text">{progress}%</p>
                </div>
            )}

            {status === 'complete' && (
                <div className="success-state glass-panel animate-fade-in">
                    <div className="success-icon">✨</div>
                    <h2 className="text-gradient">AI Processing Complete!</h2>
                    <p>We extracted 5 viral 4K clips from your video.</p>
                    <button className="btn-primary mt-4" onClick={() => window.location.reload()}>
                        View My Clips in Dashboard
                    </button>
                </div>
            )}
        </div>
    );
};

export default VideoUpload;
