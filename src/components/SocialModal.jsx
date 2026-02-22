import React, { useState } from 'react';
import './SocialModal.css';

const SOCIAL_ACCOUNTS = [
    { id: 'tiktok', name: 'TikTok', icon: '🎵', connected: true },
    { id: 'instagram', name: 'Instagram Reels', icon: '📸', connected: true },
    { id: 'youtube', name: 'YouTube Shorts', icon: '▶️', connected: false },
    { id: 'x', name: 'X (Twitter)', icon: '✖️', connected: true },
];

const SocialModal = ({ clip, onClose }) => {
    const [postingStatus, setPostingStatus] = useState('idle'); // idle | posting | success
    const [selectedAccounts, setSelectedAccounts] = useState(['tiktok', 'instagram']);

    const toggleAccount = (id) => {
        if (selectedAccounts.includes(id)) {
            setSelectedAccounts(selectedAccounts.filter(a => a !== id));
        } else {
            setSelectedAccounts([...selectedAccounts, id]);
        }
    };

    const handlePost = () => {
        if (selectedAccounts.length === 0) return;
        setPostingStatus('posting');

        // Simulate network request
        setTimeout(() => {
            setPostingStatus('success');
            setTimeout(() => {
                onClose();
            }, 2000);
        }, 2500);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content glass-panel animate-fade-in">
                <button className="close-btn" onClick={onClose}>×</button>

                <h2>Publish to Socials</h2>
                <p className="text-secondary mb-4">Select accounts to instantly post and go viral.</p>

                <div className="clip-preview mb-4">
                    <img src={clip.image} alt={clip.title} />
                    <div className="preview-details">
                        <h4>{clip.title}</h4>
                        <p className="text-gradient">2160p Output Quality</p>
                    </div>
                </div>

                {postingStatus === 'idle' && (
                    <>
                        <div className="accounts-list mb-4">
                            {SOCIAL_ACCOUNTS.map(account => (
                                <div
                                    key={account.id}
                                    className={`account-item ${selectedAccounts.includes(account.id) ? 'selected' : ''}`}
                                    onClick={() => toggleAccount(account.id)}
                                >
                                    <div className="account-info">
                                        <span className="icon">{account.icon}</span>
                                        <span>{account.name}</span>
                                    </div>
                                    <div className="account-status">
                                        {account.connected ? (
                                            <span className="checkbox">✓</span>
                                        ) : (
                                            <button className="connect-btn align-self-end">Connect</button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            className="btn-primary w-full"
                            onClick={handlePost}
                            disabled={selectedAccounts.length === 0}
                        >
                            Post Now ({selectedAccounts.length} selected)
                        </button>
                    </>
                )}

                {postingStatus === 'posting' && (
                    <div className="posting-state">
                        <div className="spinner-ring"></div>
                        <h3>Uploading to {selectedAccounts.length} platforms...</h3>
                        <p>Exporting in 4K resolution</p>
                    </div>
                )}

                {postingStatus === 'success' && (
                    <div className="success-state">
                        <div className="success-icon">🚀</div>
                        <h3 className="text-gradient">Successfully Posted!</h3>
                        <p>Your viral clip is live.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SocialModal;
