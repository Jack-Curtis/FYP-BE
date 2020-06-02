const portListService = require("../services/portListService");

async function getPortListController() {
  let response = await portListService.getPortListService();
  return response;
}

module.exports = { getPortListController };
