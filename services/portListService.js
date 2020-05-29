const SerialPort = require("serialport");

async function getPortList() {
  return new Promise((resolve) => {
    SerialPort.list().then(
      (ports) => resolve(ports),
      (err) => resolve(err)
    );
  });
}

module.exports = {
  getPortList,
};
