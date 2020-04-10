const SerialPort = require("serialport");
const errorMessage = require("./errorMessages");
const webSockettest = require("./webSocket");
const json2csv = require("json2csv").parse;
const fs = require("fs");

const fields = ["Title"];

var message = [];

async function getPortList() {
  let serialList = await SerialPort.list();
  return serialList;
}

async function portConnect(port) {
  return new Promise((resolve) => {
    try {
      port.on("error", function (err) {
        resolve(errorMessage.portBusy);
      });
      port.write("1");
      resolve("Success");
    } catch (err) {
      throw new Error("COULD NOT OPEN");
    }
  });
}

async function calibrate(port, parser) {
  port.write("3");
}

async function parseData(parser) {
  try {
    parser.on("data", (data) => {
      console.log("DATA", data);
      message.push(data);
      webSockettest.broadcastData(data);
    });
    parser.on("error", function (err) {
      console.log(err);
    });
  } catch (err) {
    console.log(err);
  }
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
  return new Promise((resolve) => {
    try {
      paths.forEach((path) => {
        var port = ports[path];
        port.write("4");
      });
    } catch (err) {
      console.log(err);
    }
  });
}

async function stopData(ports, paths) {
  return new Promise((resolve) => {
    try {
      paths.forEach((path) => {
        var port = ports[path];
        port.write("Close");
        var csv = json2csv({ message });
        fs.writeFile("file.csv", csv, function (err) {
          if (err) throw err;
          console.log("file saved");
        });
      });
    } catch (err) {
      console.log(err);
    }
  });
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
