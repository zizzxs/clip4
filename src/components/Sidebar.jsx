import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import './Sidebar.css';

const Sidebar = ({ currentView, setCurrentView }) => {
    const { user, logout } = useContext(AppContext);

    return (
        <div className="sidebar glass-panel">
            <div className="sidebar-brand">
                <h2 className="text-gradient">L2G Studio</h2>
            </div>

            <div className="sidebar-nav">
                <button
                    className={`nav-item ${currentView === 'upload' ? 'active' : ''}`}
                    onClick={() => setCurrentView('upload')}
                >
                    <span className="icon">🚀</span>
                    <span>New Video</span>
                </button>
                <button
                    className={`nav-item ${currentView === 'clips' ? 'active' : ''}`}
                    onClick={() => setCurrentView('clips')}
                >
                    <span className="icon">✂️</span>
                    <span>My Viral Clips</span>
                </button>
            </div>

            <div className="sidebar-footer">
                <div className="user-info">
                    <div className="avatar">{user?.name?.charAt(0).toUpperCase()}</div>
                    <div className="details">
                        <span className="name">{user?.name}</span>
                        <span className="plan text-gradient-pink">{user?.plan}</span>
                    </div>
                </div>
                <button className="btn-glass logout-btn" onClick={logout}>Logout</button>
            </div>
        </div>
    );
};

export default Sidebar;
