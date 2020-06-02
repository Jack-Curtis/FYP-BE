const SerialPort = require("serialport");
const errorMessages = require("../errorMessages");

async function getPortListService() {
  return new Promise((resolve) => {
    SerialPort.list().then(
      (ports) => resolve(ports),
      (err) => resolve(errorMessages.cannotGetPorts)
    );
  });
}

module.exports = {
  getPortListService,
};
