// // frontend/src/components/DirectionsModal.js
// // Modal that shows route directions with all 4 transport modes
// // Uses backend API (Geoapify key is NOT exposed in frontend)

// import React, { useState, useEffect } from 'react';
// import API from '../api/axios';
// import { FiX, FiNavigation } from 'react-icons/fi';

// // Transport mode configs
// const MODES = [
//   { key: 'walk', label: 'Walking', emoji: '🚶', color: 'bg-green-50 text-green-600 border-green-200' },
//   { key: 'drive', label: 'Driving', emoji: '🚗', color: 'bg-blue-50 text-blue-600 border-blue-200' },
//   { key: 'transit', label: 'Bus/Transit', emoji: '🚌', color: 'bg-purple-50 text-purple-600 border-purple-200' },
//   { key: 'bicycle', label: 'Bicycle', emoji: '🚴', color: 'bg-orange-50 text-orange-600 border-orange-200' },
// ];

// const DirectionsModal = ({ isOpen, onClose, userLocation, shop, onSelectRoute }) => {
//   const [routes, setRoutes] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [selectedMode, setSelectedMode] = useState('drive');

//   useEffect(() => {
//     if (isOpen && userLocation && shop) {
//       fetchAllRoutes();
//     }
//   }, [isOpen, userLocation, shop]);

//   const fetchAllRoutes = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const shopLat = shop.location.coordinates[1];
//       const shopLng = shop.location.coordinates[0];

//       // Call backend — API key is kept server-side
//       const res = await API.get('/routes', {
//         params: {
//           fromLat: userLocation.lat,
//           fromLng: userLocation.lng,
//           toLat: shopLat,
//           toLng: shopLng,
//         },
//       });

//       if (res.data.success) {
//         setRoutes(res.data.routes);
//       } else {
//         setError('Failed to fetch directions');
//       }
//     } catch (err) {
//       console.error('Directions error:', err);
//       setError(err.response?.data?.message || 'Failed to fetch directions. Try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSelectMode = (mode) => {
//     setSelectedMode(mode);
//     if (routes && routes[mode] && routes[mode].available && onSelectRoute) {
//       onSelectRoute(routes[mode]);
//     }
//   };

//   // Format time nicely
//   const formatTime = (minutes) => {
//     if (!minutes) return '—';
//     if (minutes < 60) return `${minutes} min`;
//     const hrs = Math.floor(minutes / 60);
//     const mins = minutes % 60;
//     return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
//       <div className="bg-white w-full sm:w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[85vh] overflow-y-auto shadow-2xl">
//         {/* Header */}
//         <div className="sticky top-0 bg-white border-b border-gray-100 p-4 sm:p-5 flex items-center justify-between rounded-t-2xl z-10">
//           <div>
//             <h2 className="text-lg font-bold text-gray-900">Get Directions</h2>
//             <p className="text-sm text-gray-500 mt-0.5">To {shop?.shopName}</p>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//           >
//             <FiX size={20} />
//           </button>
//         </div>

//         <div className="p-4 sm:p-5">
//           {/* Shop Info */}
//           <div className="flex items-center gap-3 mb-5 p-3 bg-gray-50 rounded-xl">
//             {shop?.image ? (
//               <img
//                 src={shop.image}
//                 alt={shop.shopName}
//                 className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
//               />
//             ) : (
//               <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
//                 🏪
//               </div>
//             )}
//             <div className="min-w-0">
//               <p className="font-semibold text-gray-900 text-sm truncate">{shop?.shopName}</p>
//               <p className="text-xs text-gray-500 truncate">{shop?.address}</p>
//             </div>
//           </div>

//           {/* Loading */}
//           {loading && (
//             <div className="flex flex-col items-center justify-center py-10">
//               <div className="w-10 h-10 border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin"></div>
//               <p className="mt-3 text-sm text-gray-500">Calculating routes...</p>
//             </div>
//           )}

//           {/* Error */}
//           {error && (
//             <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-center">
//               <p className="text-sm text-red-600">⚠️ {error}</p>
//               <button
//                 onClick={fetchAllRoutes}
//                 className="mt-2 text-xs text-red-500 underline hover:text-red-700"
//               >
//                 Retry
//               </button>
//             </div>
//           )}

//           {/* Route Cards */}
//           {routes && !loading && (
//             <div className="space-y-3">
//               {MODES.map((mode) => {
//                 const route = routes[mode.key];
//                 const isAvailable = route?.available;
//                 const isSelected = selectedMode === mode.key;

//                 return (
//                   <button
//                     key={mode.key}
//                     onClick={() => isAvailable && handleSelectMode(mode.key)}
//                     disabled={!isAvailable}
//                     className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
//                       isSelected
//                         ? 'border-primary-500 bg-primary-50 shadow-sm'
//                         : isAvailable
//                         ? 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
//                         : 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
//                     }`}
//                   >
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-3">
//                         {/* Mode Emoji */}
//                         <div
//                           className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${mode.color}`}
//                         >
//                           {mode.emoji}
//                         </div>

//                         <div>
//                           <p className="font-semibold text-gray-900 text-sm">
//                             {mode.label}
//                             {route?.estimated && (
//                               <span className="text-xs text-gray-400 font-normal ml-1">
//                                 (estimated)
//                               </span>
//                             )}
//                           </p>
//                           {isAvailable ? (
//                             <p className="text-xs text-gray-500">
//                               {route.distance} km • {formatTime(route.time)}
//                             </p>
//                           ) : (
//                             <p className="text-xs text-gray-400">Route not available</p>
//                           )}
//                         </div>
//                       </div>

//                       {/* Time Badge */}
//                       {isAvailable && (
//                         <div className="text-right flex-shrink-0">
//                           <p className="text-lg font-bold text-gray-900">
//                             {formatTime(route.time)}
//                           </p>
//                           <p className="text-xs text-gray-400">{route.distance} km</p>
//                         </div>
//                       )}
//                     </div>

//                     {/* Selected indicator */}
//                     {isSelected && isAvailable && (
//                       <div className="mt-3 flex items-center gap-2 text-xs text-primary-600 font-medium">
//                         <FiNavigation size={12} />
//                         Route shown on map
//                       </div>
//                     )}
//                   </button>
//                 );
//               })}
//             </div>
//           )}

//           {/* Show on Map Button */}
//           {routes && selectedMode && routes[selectedMode]?.available && (
//             <button
//               onClick={() => {
//                 if (onSelectRoute) onSelectRoute(routes[selectedMode]);
//                 onClose();
//               }}
//               className="w-full btn-primary mt-5 py-3 flex items-center justify-center gap-2"
//             >
//               <FiNavigation size={16} />
//               Show {MODES.find((m) => m.key === selectedMode)?.label} Route on Map
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DirectionsModal;

import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { FiX, FiNavigation } from 'react-icons/fi';

// Transport mode configs
const MODES = [
  { key: 'walk', label: 'Walking', emoji: '🚶', color: 'bg-green-50 text-green-600 border-green-200' },
  { key: 'drive', label: 'Driving', emoji: '🚗', color: 'bg-blue-50 text-blue-600 border-blue-200' },
  { key: 'transit', label: 'Bus/Transit', emoji: '🚌', color: 'bg-purple-50 text-purple-600 border-purple-200' },
  { key: 'bicycle', label: 'Bicycle', emoji: '🚴', color: 'bg-orange-50 text-orange-600 border-orange-200' },
];

const DirectionsModal = ({ isOpen, onClose, userLocation, shop, onSelectRoute }) => {
  const [routes, setRoutes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMode, setSelectedMode] = useState('drive');

  useEffect(() => {
    if (isOpen && userLocation && shop) {
      fetchAllRoutes();
    }
  }, [isOpen, userLocation, shop]);

  const fetchAllRoutes = async () => {
    setLoading(true);
    setError(null);

    try {
      const shopLat = shop.location.coordinates[1];
      const shopLng = shop.location.coordinates[0];

      // 🔍 DEBUG — remove these after fixing
      console.log('📍 FROM (user):', userLocation);
      console.log('📍 TO (shop):', { shopLat, shopLng });
      console.log('📍 RAW shop.location:', shop.location);

      // Call backend — API key is kept server-side
      const res = await API.get('/routes', {
        params: {
          fromLat: userLocation.lat,
          fromLng: userLocation.lng,
          toLat: shopLat,
          toLng: shopLng,
        },
      });

      // 🔍 DEBUG — see what backend returned
      console.log('📦 ROUTE RESPONSE:', res.data);

      if (res.data.success) {
        setRoutes(res.data.routes);
      } else {
        setError('Failed to fetch directions');
      }
    } catch (err) {
      console.error('Directions error:', err);
      setError(err.response?.data?.message || 'Failed to fetch directions. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMode = (mode) => {
    setSelectedMode(mode);
    if (routes && routes[mode] && routes[mode].available && onSelectRoute) {
      onSelectRoute(routes[mode]);
    }
  };

  // Format time nicely
  const formatTime = (minutes) => {
    if (!minutes) return '—';
    if (minutes < 60) return `${minutes} min`;
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[85vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 sm:p-5 flex items-center justify-between rounded-t-2xl z-10">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Get Directions</h2>
            <p className="text-sm text-gray-500 mt-0.5">To {shop?.shopName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="p-4 sm:p-5">
          {/* Shop Info */}
          <div className="flex items-center gap-3 mb-5 p-3 bg-gray-50 rounded-xl">
            {shop?.image ? (
              <img
                src={shop.image}
                alt={shop.shopName}
                className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                🏪
              </div>
            )}
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 text-sm truncate">{shop?.shopName}</p>
              <p className="text-xs text-gray-500 truncate">{shop?.address}</p>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="w-10 h-10 border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin"></div>
              <p className="mt-3 text-sm text-gray-500">Calculating routes...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-center">
              <p className="text-sm text-red-600">⚠️ {error}</p>
              <button
                onClick={fetchAllRoutes}
                className="mt-2 text-xs text-red-500 underline hover:text-red-700"
              >
                Retry
              </button>
            </div>
          )}

          {/* Route Cards */}
          {routes && !loading && (
            <div className="space-y-3">
              {MODES.map((mode) => {
                const route = routes[mode.key];
                const isAvailable = route?.available;
                const isSelected = selectedMode === mode.key;

                return (
                  <button
                    key={mode.key}
                    onClick={() => isAvailable && handleSelectMode(mode.key)}
                    disabled={!isAvailable}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                      isSelected
                        ? 'border-primary-500 bg-primary-50 shadow-sm'
                        : isAvailable
                        ? 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
                        : 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {/* Mode Emoji */}
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${mode.color}`}
                        >
                          {mode.emoji}
                        </div>

                        <div>
                          <p className="font-semibold text-gray-900 text-sm">
                            {mode.label}
                            {route?.estimated && (
                              <span className="text-xs text-gray-400 font-normal ml-1">
                                (estimated)
                              </span>
                            )}
                          </p>
                          {isAvailable ? (
                            <p className="text-xs text-gray-500">
                              {route.distance} km • {formatTime(route.time)}
                            </p>
                          ) : (
                            <p className="text-xs text-gray-400">Route not available</p>
                          )}
                        </div>
                      </div>

                      {/* Time Badge */}
                      {isAvailable && (
                        <div className="text-right flex-shrink-0">
                          <p className="text-lg font-bold text-gray-900">
                            {formatTime(route.time)}
                          </p>
                          <p className="text-xs text-gray-400">{route.distance} km</p>
                        </div>
                      )}
                    </div>

                    {/* Selected indicator */}
                    {isSelected && isAvailable && (
                      <div className="mt-3 flex items-center gap-2 text-xs text-primary-600 font-medium">
                        <FiNavigation size={12} />
                        Route shown on map
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Show on Map Button */}
          {routes && selectedMode && routes[selectedMode]?.available && (
            <button
              onClick={() => {
                if (onSelectRoute) onSelectRoute(routes[selectedMode]);
                onClose();
              }}
              className="w-full btn-primary mt-5 py-3 flex items-center justify-center gap-2"
            >
              <FiNavigation size={16} />
              Show {MODES.find((m) => m.key === selectedMode)?.label} Route on Map
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DirectionsModal;