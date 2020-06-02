const portConnectService = require("../services/portConnectService");
const constants = require("../constants");
const errorMessage = require("../errorMessages");

async function connectionController(path, devices) {
  let { port, parser } = await portConnectService.createConnection(
    path,
    constants.BAUDRATE
  );

  await portConnectService.initialisePortListeners(port, parser);

  let connectionStatus = await portConnectService.portConnect(
    port,
    Object.keys(devices).length
  );

  return connectionStatus === errorMessage.connectionError
    ? connectionStatus
    : { port, parser };
}

module.exports = { connectionController };
