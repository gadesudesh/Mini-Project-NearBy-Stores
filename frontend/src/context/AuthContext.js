import React, { createContext, useState, useContext, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('nbs_token');
    const savedUser = localStorage.getItem('nbs_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);

    // Get user location — default to MUMBAI if denied
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setLocation({ lat: 19.0760, lng: 72.8777 }) // Mumbai default
      );
    } else {
      setLocation({ lat: 19.0760, lng: 72.8777 }); // Mumbai default
    }
  }, []);

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    const { token: t, user: u } = res.data;
    setToken(t); setUser(u);
    localStorage.setItem('nbs_token', t);
    localStorage.setItem('nbs_user', JSON.stringify(u));
    return u;
  };

  const register = async (data) => {
    const res = await API.post('/auth/register', data);
    const { token: t, user: u } = res.data;
    setToken(t); setUser(u);
    localStorage.setItem('nbs_token', t);
    localStorage.setItem('nbs_user', JSON.stringify(u));
    return u;
  };

  const logout = () => {
    setToken(null); setUser(null);
    localStorage.removeItem('nbs_token');
    localStorage.removeItem('nbs_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, location, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};