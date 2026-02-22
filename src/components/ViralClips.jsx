import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import './ViralClips.css';
import SocialModal from './SocialModal';

const ViralClips = ({ onEdit }) => {
    const { clips } = useContext(AppContext);
    const [selectedClip, setSelectedClip] = useState(null);

    if (!clips || clips.length === 0) {
        return (
            <div className="empty-state">
                <div className="upload-icon">🎬</div>
                <h2>No Viral Clips Yet</h2>
                <p>Go to the Studio to upload a video and generate 4K clips.</p>
            </div>
        );
    }

    return (
        <div className="clips-dashboard animate-fade-in">
            <div className="dashboard-header mb-4 flex-row justify-between items-center">
                <div>
                    <h2>Your Viral Clips</h2>
                    <p className="text-secondary">Ready to post to TikTok, Reels, & Shorts in 2160p.</p>
                </div>
            </div>

            <div className="clips-grid">
                {clips.map((clip, index) => (
                    <div key={clip.id + index} className="clip-card glass-panel">
                        <div className="clip-thumbnail" style={{ backgroundImage: `url(${clip.image})` }}>
                            <div className="clip-duration">{clip.duration}</div>
                            <div className="clip-resolution">{clip.resolution}</div>
                            <div className="clip-hover-overlay">
                                <button className="btn-glass edit-btn" onClick={() => onEdit(clip)}>✨ Adv. Edit in Studio</button>
                            </div>
                        </div>

                        <div className="clip-info">
                            <h3 className="clip-title">{clip.title}</h3>

                            <div className="clip-meta">
                                <div className="virality-score">
                                    <span className="icon">🔥</span> {clip.score}/100 Score
                                </div>
                            </div>

                            <div className="clip-tags">
                                {clip.tags.map(tag => (
                                    <span key={tag} className="tag">#{tag}</span>
                                ))}
                            </div>

                            <div className="clip-actions">
                                <button className="btn-primary w-full" onClick={() => setSelectedClip(clip)}>
                                    Post to Socials
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {selectedClip && (
                <SocialModal clip={selectedClip} onClose={() => setSelectedClip(null)} />
            )}
        </div>
    );
};

export default ViralClips;
