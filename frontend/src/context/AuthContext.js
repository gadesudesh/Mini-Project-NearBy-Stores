// import React, { createContext, useState, useContext, useEffect } from 'react';
// import API from '../api/axios';

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [location, setLocation] = useState(null);

//   useEffect(() => {
//     const savedToken = localStorage.getItem('nbs_token');
//     const savedUser = localStorage.getItem('nbs_user');
//     if (savedToken && savedUser) {
//       setToken(savedToken);
//       setUser(JSON.parse(savedUser));
//     }
//     setLoading(false);

//     // Get user location — default to MUMBAI if denied
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
//         () => setLocation({ lat: 19.0760, lng: 72.8777 }) // Mumbai default
//       );
//     } else {
//       setLocation({ lat: 19.0760, lng: 72.8777 }); // Mumbai default
//     }
//   }, []);

//   const login = async (email, password) => {
//     const res = await API.post('/auth/login', { email, password });
//     const { token: t, user: u } = res.data;
//     setToken(t); setUser(u);
//     localStorage.setItem('nbs_token', t);
//     localStorage.setItem('nbs_user', JSON.stringify(u));
//     return u;
//   };

//   const register = async (data) => {
//     const res = await API.post('/auth/register', data);
//     const { token: t, user: u } = res.data;
//     setToken(t); setUser(u);
//     localStorage.setItem('nbs_token', t);
//     localStorage.setItem('nbs_user', JSON.stringify(u));
//     return u;
//   };

//   const logout = () => {
//     setToken(null); setUser(null);
//     localStorage.removeItem('nbs_token');
//     localStorage.removeItem('nbs_user');
//   };

//   return (
//     <AuthContext.Provider value={{ user, token, loading, location, login, register, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error('useAuth must be used within AuthProvider');
//   return context;
// };

// import React, { createContext, useState, useContext, useEffect } from 'react';
// import API from '../api/axios';

// const AuthContext = createContext(null);

// // ✅ Default fallback: Kanjurmarg East, Mumbai
// const DEFAULT_LOCATION = { lat: 19.1307, lng: 72.9343 };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [location, setLocation] = useState(null);

//   useEffect(() => {
//     const savedToken = localStorage.getItem('nbs_token');
//     const savedUser = localStorage.getItem('nbs_user');
//     if (savedToken && savedUser) {
//       setToken(savedToken);
//       setUser(JSON.parse(savedUser));
//     }
//     setLoading(false);

//     // Get user location — default to Kanjurmarg East if denied
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
//         () => setLocation(DEFAULT_LOCATION) // ✅ Kanjurmarg East fallback
//       );
//     } else {
//       setLocation(DEFAULT_LOCATION); // ✅ Kanjurmarg East fallback
//     }
//   }, []);

//   const login = async (email, password) => {
//     const res = await API.post('/auth/login', { email, password });
//     const { token: t, user: u } = res.data;
//     setToken(t); setUser(u);
//     localStorage.setItem('nbs_token', t);
//     localStorage.setItem('nbs_user', JSON.stringify(u));
//     return u;
//   };

//   const register = async (data) => {
//     const res = await API.post('/auth/register', data);
//     const { token: t, user: u } = res.data;
//     setToken(t); setUser(u);
//     localStorage.setItem('nbs_token', t);
//     localStorage.setItem('nbs_user', JSON.stringify(u));
//     return u;
//   };

//   const logout = () => {
//     setToken(null); setUser(null);
//     localStorage.removeItem('nbs_token');
//     localStorage.removeItem('nbs_user');
//   };

//   return (
//     <AuthContext.Provider value={{ user, token, loading, location, login, register, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error('useAuth must be used within AuthProvider');
//   return context;
// };

import React, { createContext, useState, useContext, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext(null);

// ✅ Default fallback: Mumbai center (only used if GPS is denied)
const DEFAULT_LOCATION = { lat: 19.0760, lng: 72.8777 };

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('nbs_token');
    const savedUser = localStorage.getItem('nbs_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);

    // ✅ FIX: Always get FRESH location — never use cached GPS
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newLocation = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          console.log('✅ Fresh GPS location:', newLocation);
          setLocation(newLocation);
          setLocationLoading(false);
        },
        (err) => {
          console.warn('❌ Location denied, using default:', err.message);
          setLocation(DEFAULT_LOCATION);
          setLocationLoading(false);
        },
        {
          enableHighAccuracy: true,  // ← Uses GPS, not WiFi/IP
          timeout: 15000,            // ← Wait up to 15 seconds
          maximumAge: 0,             // ← 🔴 KEY FIX: Never use cached location!
        }
      );
    } else {
      console.warn('❌ Geolocation not supported');
      setLocation(DEFAULT_LOCATION);
      setLocationLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    const { token: t, user: u } = res.data;
    setToken(t);
    setUser(u);
    localStorage.setItem('nbs_token', t);
    localStorage.setItem('nbs_user', JSON.stringify(u));
    return u;
  };

  const register = async (data) => {
    const res = await API.post('/auth/register', data);
    const { token: t, user: u } = res.data;
    setToken(t);
    setUser(u);
    localStorage.setItem('nbs_token', t);
    localStorage.setItem('nbs_user', JSON.stringify(u));
    return u;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('nbs_token');
    localStorage.removeItem('nbs_user');
  };

  // ✅ Function to manually refresh location (optional — for a "Refresh Location" button)
  const refreshLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newLocation = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          console.log('🔄 Location refreshed:', newLocation);
          setLocation(newLocation);
          setLocationLoading(false);
        },
        (err) => {
          console.warn('❌ Refresh failed:', err.message);
          setLocationLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        }
      );
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        location,
        locationLoading,
        refreshLocation,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};