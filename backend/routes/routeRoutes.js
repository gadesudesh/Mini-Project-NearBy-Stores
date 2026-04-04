// backend/routes/routeRoutes.js
const express = require('express');
const router = express.Router();
const { getDirections, getSingleRoute } = require('../controllers/routeController');

// GET /api/routes?fromLat=&fromLng=&toLat=&toLng=  — All transport modes
router.get('/', getDirections);

// GET /api/routes/single?fromLat=&fromLng=&toLat=&toLng=&mode=drive  — Single mode
router.get('/single', getSingleRoute);

module.exports = router;