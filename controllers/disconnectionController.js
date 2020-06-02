const portDisconnectService = require("../services/portDisconnectService");

async function disconnectionController(dev) {
  let response = await portDisconnectService.portDisconnect(dev.port);
  return response;
}

module.exports = { disconnectionController };
