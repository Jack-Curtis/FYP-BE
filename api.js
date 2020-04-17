const SerialPort = require("serialport");
const errorMessage = require("./errorMessages");
const webSockettest = require("./webSocket");
const json2csv = require("json2csv").parse;
const fs = require("fs");

var message = [];

async function getPortList() {
  let serialList = await SerialPort.list();
  return serialList;
}

async function portConnect(port) {
  return new Promise((resolve) => {
    port.on("error", function (err) {
      resolve(err);
    });
    port.write("1");
    resolve("Success");
  });
}

function calibrate(port) {
  port.write("3");
}

async function parseData(parser) {
  parser.on("data", (data) => {
    console.log("DATA", data);
    message.push(data);
    webSockettest.broadcastData(data);
  });
  parser.on("error", function (err) {
    throw new Error(err);
  });
}

async function portDisconnect(port) {
  return new Promise((resolve) => {
    try {
      port.close(() => {
        resolve(errorMessage.portClosed);
      });
    } catch (err) {
      resolve(errorMessage.noPort);
    }
  });
}

// TODO: take out parser and make it its own function. Only run once
// when the button is clicked. then loop over collecting data.
async function collectData(ports, paths) {
  return new Promise(() => {
    try {
      paths.forEach((path) => {
        var port = ports[path];
        port.write("4");
      });
    } catch (err) {
      throw new Error(err);
    }
  });
}

async function stopData(ports, paths) {
  try {
    paths.forEach((path) => {
      var port = ports[path];
      port.write("Stop");
      // TODO:
      // Add functionality to write to seperate files or same file with eacah IMUs data
      var csv = json2csv({ message });
      fs.writeFile("file.csv", csv, function (err) {
        if (err) throw err;
        console.log("file saved");
      });
    });
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = {
  getPortList,
  portConnect,
  portDisconnect,
  collectData,
  calibrate,
  parseData,
  stopData,
};
