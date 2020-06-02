const SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");
const writeToPort = require("../utilities/writeToPort");
const errorMessage = require("../errorMessages");
const ws = require("../utilities/webSocket");

let message = [];

function createConnection(path, baudRate) {
  return new Promise((resolve) => {
    try {
      let port = new SerialPort(path, { baudRate: baudRate, autoOpen: false });
      let parser = port.pipe(new Readline({ delimiter: "\r\n" }));

      resolve({ port, parser });
    } catch (err) {
      resolve(errorMessage.connectionError);
    }
  });
}

async function portConnect(port, imuId) {
  return new Promise((resolve) => {
    port.open(function (err) {
      if (err) {
        resolve(errorMessage.connectionError);
      }
      writeToPort.writeToPort(port, imuId.toString());
      resolve(writeToPort.writeToPort(port, "c"));
    });
  });
}

async function initialisePortListeners(port, parser) {
  try {
    port.on("error", (err) => {
      ws.broadcastData("An error occurred");
      throw err;
    });

    parser.on("data", (data) => {
      console.log(data);
      message.push(data);
      ws.broadcastData(data);
    });
  } catch (err) {
    throw err;
  }
}

module.exports = { createConnection, portConnect, initialisePortListeners };
