// https://api.openweathermap.org/data/2.5/weather?lat=50.017089&lon=36.439812&appid=6010f323d8b8a37e9d98085c21c09bd8

// Old request -> not maintain

const axios = require('axios');

const WETHER_API_KEY = '6010f323d8b8a37e9d98085c21c09bd8';
const WETHER_API_HOST = 'https://api.openweathermap.org';

function getCurrentWetherUrl(position) {
  return `${WETHER_API_HOST}/data/2.5/weather?lat=${position.lat}&lon=${position.lon}&appid=${WETHER_API_KEY}`;
}

/**
 * @typedef {{name: string}} CurrentWetherResponse
 */

/**
 * @param {{lat: string|number, lng: string|number}} position
 *
 * @returns {Promise<CurrentWetherResponse>}
 */
function loadCurrentWetherForPosition(position) {
  const CURRENT_WETHER_URL = getCurrentWetherUrl(position);
  return axios.get(CURRENT_WETHER_URL).then((res) => res.data);
}

module.exports = {
  loadCurrentWetherForPosition,
};
