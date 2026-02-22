import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import './AuthPage.css';

const AuthPage = () => {
    const { login } = useContext(AppContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        if (email) login(email);
    };

    return (
        <div className="auth-container animate-fade-in">
            <div className="auth-orb orb-1"></div>
            <div className="auth-orb orb-2"></div>

            <div className="glass-panel auth-card">
                <div className="auth-header">
                    <h1 className="text-gradient">lifechanger2go.com</h1>
                    <p>AI Viral Video Clip Generator</p>
                </div>

                <form onSubmit={handleLogin} className="auth-form flex-column">
                    <div className="input-group">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="creator@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group mb-4">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary w-full mb-2">
                        Enter Studio
                    </button>

                    <div className="divider"><span>OR</span></div>

                    <button type="button" className="btn-glass w-full" onClick={() => login('google_user@test.com')}>
                        Continue with Google
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AuthPage;
