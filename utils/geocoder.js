const NodeGeocoder = require("node-geocoder");

module.exports = NodeGeocoder({
  provider: process.env.GEOCODER_PROVIDER,
  httpAdapter: "https",
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
});
