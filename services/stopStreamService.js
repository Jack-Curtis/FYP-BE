const writeToPort = require("../utilities/writeToPort");
const errorMessages = require("../errorMessages");

async function stopStreamService(devices) {
  return new Promise((resolve) => {
    try {
      devices.forEach((dev) => {
        writeToPort(dev.port, "Stop");
      });
      // saveData();
      resolve(errorMessages.writeSuccess);
    } catch (err) {
      console.log(err);
      resolve(errorMessages.writeError);
    }
  });
}

module.exports = { stopStreamService };
