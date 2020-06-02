const startStreamService = require("../services/startStreamService");

async function startStreamController(devices) {
  let response = await startStreamService.startStreamService(devices);
  return response;
}

module.exports = { startStreamController };
