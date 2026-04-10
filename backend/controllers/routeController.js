// // backend/controllers/routeController.js
// // Handles route/directions requests via Geoapify Routing API
// // API key is kept server-side only (never exposed to frontend)

// const GEOAPIFY_KEY = process.env.GEOAPIFY_API_KEY;

// // Transport mode mapping for Geoapify API
// const TRANSPORT_MODES = {
//   walk: 'walk',
//   drive: 'drive',
//   bicycle: 'bicycle',
//   transit: 'transit',
// };

// /**
//  * @desc    Get route directions between two points for ALL transport modes
//  * @route   GET /api/routes?fromLat=&fromLng=&toLat=&toLng=
//  * @access  Public
//  */
// exports.getDirections = async (req, res) => {
//   try {
//     const { fromLat, fromLng, toLat, toLng } = req.query;

//     // Validate required params
//     if (!fromLat || !fromLng || !toLat || !toLng) {
//       return res.status(400).json({
//         success: false,
//         message: 'Missing required parameters: fromLat, fromLng, toLat, toLng',
//       });
//     }

//     if (!GEOAPIFY_KEY) {
//       return res.status(500).json({
//         success: false,
//         message: 'Geoapify API key not configured on server',
//       });
//     }

//     // Fetch routes for ALL transport modes in parallel
//     const modes = ['drive', 'walk', 'bicycle', 'transit'];

//     const routePromises = modes.map(async (mode) => {
//       try {
//         const url = `https://api.geoapify.com/v1/routing?waypoints=${fromLat},${fromLng}|${toLat},${toLng}&mode=${mode}&apiKey=${GEOAPIFY_KEY}`;
        
//         const response = await fetch(url);
        
//         if (!response.ok) {
//           // Transit might not be available in all areas
//           return { mode, available: false, error: `API returned ${response.status}` };
//         }

//         const data = await response.json();

//         if (!data.features || data.features.length === 0) {
//           return { mode, available: false, error: 'No route found' };
//         }

//         const feature = data.features[0];
//         const props = feature.properties;
//         const geometry = feature.geometry;

//         // Extract coordinates — Geoapify returns [lng, lat], we convert to [lat, lng]
//         let coordinates = [];
//         if (geometry.type === 'MultiLineString') {
//           geometry.coordinates.forEach((line) => {
//             line.forEach((coord) => {
//               coordinates.push([coord[1], coord[0]]);
//             });
//           });
//         } else if (geometry.type === 'LineString') {
//           geometry.coordinates.forEach((coord) => {
//             coordinates.push([coord[1], coord[0]]);
//           });
//         }

//         return {
//           mode,
//           available: true,
//           distance: parseFloat((props.distance / 1000).toFixed(1)), // km
//           time: Math.round(props.time / 60), // minutes
//           coordinates, // [lat, lng] pairs for Leaflet polyline
//         };
//       } catch (err) {
//         return { mode, available: false, error: err.message };
//       }
//     });

//     const results = await Promise.all(routePromises);

//     // Build response object
//     const routes = {};
//     results.forEach((r) => {
//       routes[r.mode] = r;
//     });

//     // If transit is not available, estimate it from driving time
//     if (!routes.transit?.available && routes.drive?.available) {
//       routes.transit = {
//         mode: 'transit',
//         available: true,
//         estimated: true,
//         distance: routes.drive.distance,
//         time: Math.round(routes.drive.time * 1.4), // ~40% longer than driving
//         coordinates: routes.drive.coordinates, // use driving route as approximation
//       };
//     }

//     res.json({
//       success: true,
//       from: { lat: parseFloat(fromLat), lng: parseFloat(fromLng) },
//       to: { lat: parseFloat(toLat), lng: parseFloat(toLng) },
//       routes,
//     });
//   } catch (error) {
//     console.error('Route directions error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch directions',
//       error: error.message,
//     });
//   }
// };

// /**
//  * @desc    Get route for a SINGLE transport mode (lightweight)
//  * @route   GET /api/routes/single?fromLat=&fromLng=&toLat=&toLng=&mode=drive
//  * @access  Public
//  */
// exports.getSingleRoute = async (req, res) => {
//   try {
//     const { fromLat, fromLng, toLat, toLng, mode = 'drive' } = req.query;

//     if (!fromLat || !fromLng || !toLat || !toLng) {
//       return res.status(400).json({
//         success: false,
//         message: 'Missing required parameters',
//       });
//     }

//     const validMode = TRANSPORT_MODES[mode] || 'drive';

//     const url = `https://api.geoapify.com/v1/routing?waypoints=${fromLat},${fromLng}|${toLat},${toLng}&mode=${validMode}&apiKey=${GEOAPIFY_KEY}`;

//     const response = await fetch(url);

//     if (!response.ok) {
//       return res.status(response.status).json({
//         success: false,
//         message: `Geoapify API error: ${response.status}`,
//       });
//     }

//     const data = await response.json();

//     if (!data.features || data.features.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'No route found',
//       });
//     }

//     const feature = data.features[0];
//     const props = feature.properties;
//     const geometry = feature.geometry;

//     let coordinates = [];
//     if (geometry.type === 'MultiLineString') {
//       geometry.coordinates.forEach((line) => {
//         line.forEach((coord) => {
//           coordinates.push([coord[1], coord[0]]);
//         });
//       });
//     } else if (geometry.type === 'LineString') {
//       geometry.coordinates.forEach((coord) => {
//         coordinates.push([coord[1], coord[0]]);
//       });
//     }

//     res.json({
//       success: true,
//       mode: validMode,
//       distance: parseFloat((props.distance / 1000).toFixed(1)),
//       time: Math.round(props.time / 60),
//       coordinates,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// backend/controllers/routeController.js
// Handles route/directions requests via Geoapify Routing API
// API key is kept server-side only (never exposed to frontend)

const GEOAPIFY_KEY = process.env.GEOAPIFY_API_KEY;

// Transport mode mapping for Geoapify API
const TRANSPORT_MODES = {
  walk: 'walk',
  drive: 'drive',
  bicycle: 'bicycle',
  transit: 'transit',
};

/**
 * @desc    Get route directions between two points for ALL transport modes
 * @route   GET /api/routes?fromLat=&fromLng=&toLat=&toLng=
 * @access  Public
 */
exports.getDirections = async (req, res) => {
  try {
    const { fromLat, fromLng, toLat, toLng } = req.query;

    // 🔍 DEBUG — remove after fixing
    console.log('🔍 ROUTE REQUEST:', { fromLat, fromLng, toLat, toLng });
    console.log('🔑 API KEY exists:', !!GEOAPIFY_KEY);

    // Validate required params
    if (!fromLat || !fromLng || !toLat || !toLng) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: fromLat, fromLng, toLat, toLng',
      });
    }

    if (!GEOAPIFY_KEY) {
      return res.status(500).json({
        success: false,
        message: 'Geoapify API key not configured on server',
      });
    }

    // Fetch routes for ALL transport modes in parallel
    const modes = ['drive', 'walk', 'bicycle', 'transit'];

    const routePromises = modes.map(async (mode) => {
      try {
        const url = `https://api.geoapify.com/v1/routing?waypoints=${fromLat},${fromLng}|${toLat},${toLng}&mode=${mode}&apiKey=${GEOAPIFY_KEY}`;

        // 🔍 DEBUG — see exact URL being called
        console.log(`🌐 [${mode}] Geoapify URL:`, url.replace(GEOAPIFY_KEY, 'HIDDEN'));

        const response = await fetch(url);

        // 🔍 DEBUG — see response status
        console.log(`📡 [${mode}] Response status:`, response.status);

        if (!response.ok) {
          return { mode, available: false, error: `API returned ${response.status}` };
        }

        const data = await response.json();

        // 🔍 DEBUG — see raw Geoapify response
        console.log(`📦 [${mode}] Features found:`, data.features?.length || 0);
        if (data.features?.[0]?.properties) {
          const p = data.features[0].properties;
          console.log(`📏 [${mode}] Raw distance: ${p.distance}m, Raw time: ${p.time}s`);
        }

        if (!data.features || data.features.length === 0) {
          return { mode, available: false, error: 'No route found' };
        }

        const feature = data.features[0];
        const props = feature.properties;
        const geometry = feature.geometry;

        // Extract coordinates — Geoapify returns [lng, lat], we convert to [lat, lng]
        let coordinates = [];
        if (geometry.type === 'MultiLineString') {
          geometry.coordinates.forEach((line) => {
            line.forEach((coord) => {
              coordinates.push([coord[1], coord[0]]);
            });
          });
        } else if (geometry.type === 'LineString') {
          geometry.coordinates.forEach((coord) => {
            coordinates.push([coord[1], coord[0]]);
          });
        }

        const result = {
          mode,
          available: true,
          distance: parseFloat((props.distance / 1000).toFixed(1)), // km
          time: Math.round(props.time / 60), // minutes
          coordinates, // [lat, lng] pairs for Leaflet polyline
        };

        // 🔍 DEBUG — see final result
        console.log(`✅ [${mode}] Final: ${result.distance}km, ${result.time}min`);

        return result;
      } catch (err) {
        console.error(`❌ [${mode}] Error:`, err.message);
        return { mode, available: false, error: err.message };
      }
    });

    const results = await Promise.all(routePromises);

    // Build response object
    const routes = {};
    results.forEach((r) => {
      routes[r.mode] = r;
    });

    // If transit is not available, estimate it from driving time
    if (!routes.transit?.available && routes.drive?.available) {
      routes.transit = {
        mode: 'transit',
        available: true,
        estimated: true,
        distance: routes.drive.distance,
        time: Math.round(routes.drive.time * 1.4),
        coordinates: routes.drive.coordinates,
      };
    }

    res.json({
      success: true,
      from: { lat: parseFloat(fromLat), lng: parseFloat(fromLng) },
      to: { lat: parseFloat(toLat), lng: parseFloat(toLng) },
      routes,
    });
  } catch (error) {
    console.error('Route directions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch directions',
      error: error.message,
    });
  }
};

/**
 * @desc    Get route for a SINGLE transport mode (lightweight)
 * @route   GET /api/routes/single?fromLat=&fromLng=&toLat=&toLng=&mode=drive
 * @access  Public
 */
exports.getSingleRoute = async (req, res) => {
  try {
    const { fromLat, fromLng, toLat, toLng, mode = 'drive' } = req.query;

    if (!fromLat || !fromLng || !toLat || !toLng) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters',
      });
    }

    const validMode = TRANSPORT_MODES[mode] || 'drive';

    const url = `https://api.geoapify.com/v1/routing?waypoints=${fromLat},${fromLng}|${toLat},${toLng}&mode=${validMode}&apiKey=${GEOAPIFY_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: `Geoapify API error: ${response.status}`,
      });
    }

    const data = await response.json();

    if (!data.features || data.features.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No route found',
      });
    }

    const feature = data.features[0];
    const props = feature.properties;
    const geometry = feature.geometry;

    let coordinates = [];
    if (geometry.type === 'MultiLineString') {
      geometry.coordinates.forEach((line) => {
        line.forEach((coord) => {
          coordinates.push([coord[1], coord[0]]);
        });
      });
    } else if (geometry.type === 'LineString') {
      geometry.coordinates.forEach((coord) => {
        coordinates.push([coord[1], coord[0]]);
      });
    }

    res.json({
      success: true,
      mode: validMode,
      distance: parseFloat((props.distance / 1000).toFixed(1)),
      time: Math.round(props.time / 60),
      coordinates,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};