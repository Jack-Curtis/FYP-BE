const errorMessage = require("../errorMessages");

async function portDisconnect(port) {
  return new Promise((resolve) => {
    try {
      port.close((err) => {
        err
          ? resolve(errorMessage.closeError)
          : resolve(errorMessage.portClosed);
      });
    } catch (err) {
      resolve(errorMessage.noPort);
    }
  });
}

module.exports = { portDisconnect };
