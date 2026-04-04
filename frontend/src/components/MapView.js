// frontend/src/components/MapView.js
// FEATURE 1: Route polyline on map
// FEATURE 4: All shop markers with popup details + images
// Uses Geoapify tiles (key kept for tiles only — routing goes via backend)

import React, { useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const shopIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

const selectedShopIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

// Geoapify key for MAP TILES only (routing uses backend)
const GEOAPIFY_TILE_KEY = '1fdc3523200949f58970d375dc9253e4';

function RecenterMap({ lat, lng, zoom }) {
  const map = useMap();
  React.useEffect(() => {
    if (lat && lng) map.setView([lat, lng], zoom || 14);
  }, [lat, lng, zoom, map]);
  return null;
}

function FitBounds({ bounds }) {
  const map = useMap();
  React.useEffect(() => {
    if (bounds && bounds.length >= 2) {
      map.fitBounds(bounds, { padding: [60, 60] });
    }
  }, [bounds, map]);
  return null;
}

const MapView = ({
  center,
  shops = [],
  userLocation,
  onShopClick,
  height = '400px',
  enableRouting = false,
  activeRouteCoords = [], // externally provided route (from DirectionsModal)
}) => {
  const mapCenter = center || userLocation || { lat: 19.0760, lng: 72.8777 };
  
  // Internal routing state (for click-to-route on dashboard map)
  const [internalRoute, setInternalRoute] = useState([]);
  const [internalRouteInfo, setInternalRouteInfo] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [selectedShopId, setSelectedShopId] = useState(null);

  // Determine which route to show — external (from DirectionsModal) takes priority
  const displayRoute = activeRouteCoords.length > 0 ? activeRouteCoords : internalRoute;

  // Compute bounds for route display
  const routeBounds =
    displayRoute.length > 0 && userLocation
      ? [
          [userLocation.lat, userLocation.lng],
          displayRoute[displayRoute.length - 1],
        ]
      : null;

  // Fetch route via BACKEND (keeps API key secure)
  const fetchRouteViaBackend = useCallback(
    async (shop) => {
      if (!userLocation) return;
      setRouteLoading(true);

      try {
        const shopLat = shop.location.coordinates[1];
        const shopLng = shop.location.coordinates[0];

        const res = await fetch(
          `http://localhost:5000/api/routes/single?fromLat=${userLocation.lat}&fromLng=${userLocation.lng}&toLat=${shopLat}&toLng=${shopLng}&mode=drive`
        );
        const data = await res.json();

        if (data.success && data.coordinates) {
          setInternalRoute(data.coordinates);
          setInternalRouteInfo({ distance: data.distance, time: data.time });
        }
      } catch (err) {
        console.error('Route fetch error:', err);
      } finally {
        setRouteLoading(false);
      }
    },
    [userLocation]
  );

  const handleShopMarkerClick = (shop) => {
    if (onShopClick) onShopClick(shop._id);

    if (enableRouting && userLocation && activeRouteCoords.length === 0) {
      setSelectedShopId(shop._id);
      fetchRouteViaBackend(shop);
    }
  };

  const clearInternalRoute = () => {
    setInternalRoute([]);
    setInternalRouteInfo(null);
    setSelectedShopId(null);
  };

  return (
    <div className="relative">
      {/* Internal route info (from marker click) */}
      {internalRouteInfo && activeRouteCoords.length === 0 && (
        <div className="absolute top-3 left-3 right-3 z-[1000] bg-white rounded-xl shadow-lg border border-gray-200 p-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">🚗</span>
              <div>
                <p className="text-sm font-bold text-gray-900">{internalRouteInfo.distance} km</p>
                <p className="text-xs text-gray-500">
                  {internalRouteInfo.time < 60
                    ? `${internalRouteInfo.time} min`
                    : `${Math.floor(internalRouteInfo.time / 60)}h ${internalRouteInfo.time % 60}m`}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={clearInternalRoute}
            className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 font-medium"
          >
            ✕ Clear
          </button>
        </div>
      )}

      {/* Loading */}
      {routeLoading && (
        <div className="absolute top-3 left-3 right-3 z-[1000] bg-white rounded-xl shadow-lg border p-3 flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-gray-200 border-t-primary-600 rounded-full animate-spin"></div>
          <span className="text-sm text-gray-600">Finding route...</span>
        </div>
      )}

      {/* Hint */}
      {enableRouting && !internalRouteInfo && !routeLoading && activeRouteCoords.length === 0 && (
        <div className="absolute bottom-3 left-3 z-[1000] bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border px-3 py-2">
          <p className="text-xs text-gray-500">💡 Click a shop marker to see route</p>
        </div>
      )}

      {/* Map */}
      <div style={{ height }} className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
        <MapContainer
          center={[mapCenter.lat, mapCenter.lng]}
          zoom={14}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.geoapify.com/">Geoapify</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            url={`https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${GEOAPIFY_TILE_KEY}`}
          />

          <RecenterMap lat={mapCenter.lat} lng={mapCenter.lng} />
          {routeBounds && <FitBounds bounds={routeBounds} />}

          {/* User marker */}
          {userLocation && (
            <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
              <Popup><strong>📍 Your Location</strong></Popup>
            </Marker>
          )}

          {/* Shop markers */}
          {shops.map((shop) => (
            <Marker
              key={shop._id}
              position={[shop.location.coordinates[1], shop.location.coordinates[0]]}
              icon={selectedShopId === shop._id ? selectedShopIcon : shopIcon}
              eventHandlers={{ click: () => handleShopMarkerClick(shop) }}
            >
              <Popup>
                <div style={{ minWidth: '180px', maxWidth: '250px' }}>
                  {shop.image && (
                    <img
                      src={shop.image}
                      alt={shop.shopName}
                      style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '8px', marginBottom: '6px' }}
                    />
                  )}
                  <strong style={{ fontSize: '13px' }}>{shop.shopName}</strong><br />
                  <span style={{ fontSize: '11px', color: '#666' }}>{shop.address}</span>
                  {shop.distance && (
                    <><br /><span style={{ color: '#2563eb', fontWeight: 600, fontSize: '11px' }}>📍 {shop.distance} km</span></>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Route polyline shadow */}
          {displayRoute.length > 0 && (
            <Polyline
              positions={displayRoute}
              pathOptions={{ color: '#93c5fd', weight: 10, opacity: 0.4, lineCap: 'round', lineJoin: 'round' }}
            />
          )}

          {/* Route polyline */}
          {displayRoute.length > 0 && (
            <Polyline
              positions={displayRoute}
              pathOptions={{ color: '#2563eb', weight: 5, opacity: 0.85, lineCap: 'round', lineJoin: 'round' }}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapView;