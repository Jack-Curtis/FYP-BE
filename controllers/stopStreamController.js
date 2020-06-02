const stopStreamService = require("../services/stopStreamService");

async function stopStreamController(devices) {
  let response = await stopStreamService.stopStreamService(devices);
  return response;
}

module.exports = { stopStreamController };
