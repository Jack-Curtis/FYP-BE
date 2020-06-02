const writeToPort = require("../utilities/writeToPort");

const errorMessages = require("../errorMessages");

async function startStreamService(devices) {
  return new Promise((resolve) => {
    try {
      devices.forEach((dev) => {
        writeToPort(dev.port, "r");
      });
      resolve(errorMessages.writeSuccess);
    } catch (err) {
      console.log(err);
      resolve(errorMessages.writeError);
    }
  });
}

module.exports = { startStreamService };
