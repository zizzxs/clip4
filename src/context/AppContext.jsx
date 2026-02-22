import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('lifechanger_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [clips, setClips] = useState(() => {
    const saved = localStorage.getItem('lifechanger_clips');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('lifechanger_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('lifechanger_clips', JSON.stringify(clips));
  }, [clips]);

  const login = (email) => {
    setUser({ email, name: email.split('@')[0], plan: 'Pro Creator' });
  };

  const logout = () => {
    setUser(null);
  };

  const addClips = (newClips) => {
    setClips(prev => [...newClips, ...prev]);
  };

  return (
    <AppContext.Provider value={{ user, login, logout, clips, addClips }}>
      {children}
    </AppContext.Provider>
  );
};
