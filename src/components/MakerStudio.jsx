import React, { useState, useRef, useEffect } from 'react';
import './MakerStudio.css';

const MakerStudio = ({ clip, onClose }) => {
    const [activeTab, setActiveTab] = useState('templates'); // templates | text | captions | elements
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current) {
            if (isPlaying) videoRef.current.play();
            else videoRef.current.pause();
        }
    }, [isPlaying]);

    const togglePlay = () => setIsPlaying(!isPlaying);

    return (
        <div className="maker-studio animate-fade-in">
            <header className="studio-topbar">
                <div className="left-actions">
                    <button className="btn-glass back-btn" onClick={onClose}>← Back to Clips</button>
                    <div className="project-title">
                        <span className="icon">🎬</span>
                        <input type="text" defaultValue={clip?.title || "Untitled Viral Clip"} />
                    </div>
                </div>

                <div className="center-actions">
                    <button className="btn-glass tool-btn">↩</button>
                    <button className="btn-glass tool-btn">↪</button>
                </div>

                <div className="right-actions">
                    <span className="resolution-badge">2160p (4K)</span>
                    <button className="btn-primary export-btn">Export & Share</button>
                </div>
            </header>

            <div className="studio-main">
                {/* Left Sidebar - Assets */}
                <div className="studio-sidebar">
                    <div className="tab-nav">
                        <button className={`tab-btn ${activeTab === 'templates' ? 'active' : ''}`} onClick={() => setActiveTab('templates')}>
                            ✨<br />Design
                        </button>
                        <button className={`tab-btn ${activeTab === 'text' ? 'active' : ''}`} onClick={() => setActiveTab('text')}>
                            T<br />Text
                        </button>
                        <button className={`tab-btn ${activeTab === 'captions' ? 'active' : ''}`} onClick={() => setActiveTab('captions')}>
                            💬<br />Captions
                        </button>
                        <button className={`tab-btn ${activeTab === 'elements' ? 'active' : ''}`} onClick={() => setActiveTab('elements')}>
                            ⭐<br />Elements
                        </button>
                    </div>

                    <div className="tab-content glass-panel">
                        {activeTab === 'templates' && (
                            <div className="assets-grid templates">
                                <h3>Viral Templates</h3>
                                <div className="asset-card">Alex Hormozi Style</div>
                                <div className="asset-card">MrBeast Gaming</div>
                                <div className="asset-card">Podcast Minimal</div>
                                <div className="asset-card">Motivation Neon</div>
                            </div>
                        )}
                        {activeTab === 'text' && (
                            <div className="assets-grid text-tools">
                                <h3>Add Text</h3>
                                <button className="btn-glass w-full mb-2">Add a heading</button>
                                <button className="btn-glass w-full mb-2" style={{ fontSize: '14px' }}>Add a subheading</button>
                                <button className="btn-glass w-full" style={{ fontSize: '12px' }}>Add a body text</button>
                            </div>
                        )}
                        {activeTab === 'captions' && (
                            <div className="assets-grid captions-tools">
                                <h3>AI Auto-Captions</h3>
                                <button className="btn-primary w-full mb-4">✨ Generate Captions</button>
                                <div className="caption-style-card active">Bold & Dynamic</div>
                                <div className="caption-style-card">Clean & Professional</div>
                            </div>
                        )}
                        {activeTab === 'elements' && (
                            <div className="assets-grid elements">
                                <h3>B-Roll & Stickers</h3>
                                <div className="element-grid">
                                    <div className="el-box">🔥</div>
                                    <div className="el-box">💯</div>
                                    <div className="el-box">📉</div>
                                    <div className="el-box">✅</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Center - Canvas Preview */}
                <div className="studio-canvas-area">
                    <div className="canvas-wrapper">
                        {/* The actual video / design canvas */}
                        <div className="design-canvas">
                            {clip?.realVideoUrl ? (
                                <video
                                    ref={videoRef}
                                    src={clip.realVideoUrl}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    loop
                                    playsInline
                                />
                            ) : (
                                <div className="video-layer" style={{ backgroundImage: `url(${clip?.image || 'https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&q=80&w=600'})` }}></div>
                            )}
                            {/* Draggable Overlays */}
                            <div className="canvas-overlay caption-overlay pulse-anim">
                                "Here is the secret to <span>HOOKING</span> your audience..."
                            </div>
                            <div className="canvas-overlay sticker-overlay">🔥</div>
                        </div>

                        {/* Playback Controls beneath canvas */}
                        <div className="playback-controls">
                            <span className="time-code">00:03.4 / {clip?.duration || "00:45.0"}</span>
                            <div className="controls-center">
                                <button className="ctrl-btn">⏮</button>
                                <button className="ctrl-btn play-btn" onClick={togglePlay}>
                                    {isPlaying ? '⏸' : '▶'}
                                </button>
                                <button className="ctrl-btn">⏭</button>
                            </div>
                            <button className="ctrl-btn full-btn">⛶</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom - Timeline */}
            <div className="studio-timeline-area glass-panel">
                <div className="timeline-tools">
                    <button className="tool-btn">✂️ Split</button>
                    <button className="tool-btn">🗑️ Delete</button>
                    <button className="tool-btn">🔊 Audio</button>

                    <div className="zoom-control">
                        <span>🔍-</span>
                        <input type="range" defaultValue={50} />
                        <span>+</span>
                    </div>
                </div>

                <div className="timeline-tracks">
                    <div className="playhead"></div>

                    {/* Main Video Track */}
                    <div className="track-container">
                        <div className="track-label">Video</div>
                        <div className="track-lane">
                            <div className="clip-segment main-clip" style={{ width: '60%' }}>
                                <span className="clip-name">source_video.mp4</span>
                                <div className="thumbnails-row"></div>
                            </div>
                            <div className="clip-segment main-clip" style={{ left: '61%', width: '30%' }}>
                                <span className="clip-name">b_roll_nature.mp4</span>
                            </div>
                        </div>
                    </div>

                    {/* Text/Captions Track */}
                    <div className="track-container">
                        <div className="track-label">Text</div>
                        <div className="track-lane">
                            <div className="clip-segment text-clip" style={{ left: '10%', width: '15%' }}>
                                "Here is the secret..."
                            </div>
                            <div className="clip-segment text-clip" style={{ left: '26%', width: '10%' }}>
                                "to HOOKING..."
                            </div>
                        </div>
                    </div>

                    {/* Audio Track */}
                    <div className="track-container">
                        <div className="track-label">Audio</div>
                        <div className="track-lane">
                            <div className="clip-segment audio-clip" style={{ width: '95%' }}>
                                Ambient Beat 01
                                <div className="waveform"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MakerStudio;
