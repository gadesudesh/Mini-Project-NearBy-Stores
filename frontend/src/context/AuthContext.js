

// import React, { createContext, useState, useContext, useEffect } from 'react';
// import API from '../api/axios';

// const AuthContext = createContext(null);

// // ✅ Default fallback: Mumbai center (only used if GPS is denied)
// const DEFAULT_LOCATION = { lat: 19.0760, lng: 72.8777 };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [location, setLocation] = useState(null);
//   const [locationLoading, setLocationLoading] = useState(true);

//   useEffect(() => {
//     const savedToken = localStorage.getItem('nbs_token');
//     const savedUser = localStorage.getItem('nbs_user');
//     if (savedToken && savedUser) {
//       setToken(savedToken);
//       setUser(JSON.parse(savedUser));
//     }
//     setLoading(false);

//     // ✅ FIX: Always get FRESH location — never use cached GPS
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (pos) => {
//           const newLocation = {
//             lat: pos.coords.latitude,
//             lng: pos.coords.longitude,
//           };
//           console.log('✅ Fresh GPS location:', newLocation);
//           setLocation(newLocation);
//           setLocationLoading(false);
//         },
//         (err) => {
//           console.warn('❌ Location denied, using default:', err.message);
//           setLocation(DEFAULT_LOCATION);
//           setLocationLoading(false);
//         },
//         {
//           enableHighAccuracy: true,  // ← Uses GPS, not WiFi/IP
//           timeout: 15000,            // ← Wait up to 15 seconds
//           maximumAge: 0,             // ← 🔴 KEY FIX: Never use cached location!
//         }
//       );
//     } else {
//       console.warn('❌ Geolocation not supported');
//       setLocation(DEFAULT_LOCATION);
//       setLocationLoading(false);
//     }
//   }, []);

//   const login = async (email, password) => {
//     const res = await API.post('/auth/login', { email, password });
//     const { token: t, user: u } = res.data;
//     setToken(t);
//     setUser(u);
//     localStorage.setItem('nbs_token', t);
//     localStorage.setItem('nbs_user', JSON.stringify(u));
//     return u;
//   };

//   const register = async (data) => {
//     const res = await API.post('/auth/register', data);
//     const { token: t, user: u } = res.data;
//     setToken(t);
//     setUser(u);
//     localStorage.setItem('nbs_token', t);
//     localStorage.setItem('nbs_user', JSON.stringify(u));
//     return u;
//   };

//   const logout = () => {
//     setToken(null);
//     setUser(null);
//     localStorage.removeItem('nbs_token');
//     localStorage.removeItem('nbs_user');
//   };

//   // ✅ Function to manually refresh location (optional — for a "Refresh Location" button)
//   const refreshLocation = () => {
//     setLocationLoading(true);
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (pos) => {
//           const newLocation = {
//             lat: pos.coords.latitude,
//             lng: pos.coords.longitude,
//           };
//           console.log('🔄 Location refreshed:', newLocation);
//           setLocation(newLocation);
//           setLocationLoading(false);
//         },
//         (err) => {
//           console.warn('❌ Refresh failed:', err.message);
//           setLocationLoading(false);
//         },
//         {
//           enableHighAccuracy: true,
//           timeout: 15000,
//           maximumAge: 0,
//         }
//       );
//     }
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         token,
//         loading,
//         location,
//         locationLoading,
//         refreshLocation,
//         login,
//         register,
//         logout,
//       }}
//     >
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

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null); // ✅ null until real GPS comes
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState(null);
  const [locationPermission, setLocationPermission] = useState('prompt'); // 'prompt' | 'granted' | 'denied'

  useEffect(() => {
    const savedToken = localStorage.getItem('nbs_token');
    const savedUser = localStorage.getItem('nbs_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // ✅ Separate useEffect for location — runs independently
  useEffect(() => {
    requestLocation();
  }, []);

  const requestLocation = () => {
    setLocationLoading(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      console.warn('❌ Geolocation not supported');
      setLocationError('Geolocation is not supported by your browser.');
      setLocationPermission('denied');
      setLocationLoading(false);
      return;
    }

    // ✅ Check permission status first (if supported)
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        console.log('📍 Permission status:', result.state);
        setLocationPermission(result.state);

        // ✅ Listen for permission changes (user toggles in settings)
        result.onchange = () => {
          console.log('📍 Permission changed to:', result.state);
          setLocationPermission(result.state);
          if (result.state === 'granted') {
            // ✅ Auto-fetch location when user enables from settings
            getGPSLocation();
          }
        };
      }).catch(() => {
        // permissions API not supported, just try GPS
      });
    }

    getGPSLocation();
  };

  const getGPSLocation = () => {
    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newLocation = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        console.log('✅ Fresh GPS location:', newLocation);
        setLocation(newLocation);
        setLocationError(null);
        setLocationPermission('granted');
        setLocationLoading(false);
      },
      (err) => {
        console.warn('❌ Location error:', err.code, err.message);
        setLocationLoading(false);

        switch (err.code) {
          case err.PERMISSION_DENIED:
            setLocationError('denied');
            setLocationPermission('denied');
            break;
          case err.POSITION_UNAVAILABLE:
            setLocationError('unavailable');
            setLocationPermission('denied');
            break;
          case err.TIMEOUT:
            setLocationError('timeout');
            break;
          default:
            setLocationError('unknown');
            break;
        }

        // ❌ Do NOT set default location — force user to allow
        // setLocation(DEFAULT_LOCATION);  ← REMOVED!
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  const refreshLocation = () => {
    requestLocation();
  };

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

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        location,
        locationLoading,
        locationError,
        locationPermission,
        refreshLocation,
        requestLocation,
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