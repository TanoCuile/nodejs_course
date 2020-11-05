const express = require('express');
const { loadCurrentWetherForPosition } = require('../wether.loader');

async function loadWether(bag, res) {
  const requestedPosition = {
    lat: bag.lat || 50.017089,
    lon: bag.lon || 36.439812,
  };

  return res.json(await loadCurrentWetherForPosition(requestedPosition));
}
/**
 * @param {import('express').Application} app
 */
function initializeWetherRoutes(app) {
  app.get('/', async (req, res) => loadWether(req.query, res));

  app.post('/', express.urlencoded(), async (req, res) => loadWether(req.body, res));
}
exports.initializeWetherRoutes = initializeWetherRoutes;
