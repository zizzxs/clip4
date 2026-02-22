import React, { useState } from 'react';
import Sidebar from './Sidebar';
import './Layout.css';

// Placeholders for views
import VideoUpload from './VideoUpload';
import ViralClips from './ViralClips';
import MakerStudio from './MakerStudio';

const Layout = () => {
    const [currentView, setCurrentView] = useState('upload'); // 'upload' | 'clips'
    const [editingClip, setEditingClip] = useState(null);

    return (
        <div className="layout-container animate-fade-in">
            <Sidebar currentView={currentView} setCurrentView={setCurrentView} />

            {editingClip ? (
                <MakerStudio clip={editingClip} onClose={() => setEditingClip(null)} />
            ) : (
                <main className="main-content">
                    <header className="topbar">
                        <div className="search-bar">
                            <input type="text" placeholder="Search across videos, titles, or tags..." />
                            <button className="search-btn">🔍</button>
                        </div>
                        <div className="topbar-actions">
                            <button className="btn-glass">🔔</button>
                            <button className="btn-primary" onClick={() => setCurrentView('upload')}>+ New Video</button>
                        </div>
                    </header>
                    <div className="content-area">
                        {currentView === 'upload' && <VideoUpload />}
                        {currentView === 'clips' && <ViralClips onEdit={(clip) => setEditingClip(clip)} />}
                    </div>
                </main>
            )}
        </div>
    );
};

export default Layout;
