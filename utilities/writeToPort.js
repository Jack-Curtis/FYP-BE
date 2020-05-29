const errorMessage = require("../errorMessages");

async function writeToPort(port, message) {
  return new Promise((resolve) => {
    if (port.isOpen) {
      port.write(message, (err) => {
        let response;
        err
          ? (response = errorMessage.writeError)
          : (response = errorMessage.writeSuccess);
        resolve(response);
      });
    } else {
      resolve(errorMessage.portClosed);
    }
  });
}

module.exports = {
  writeToPort,
};
