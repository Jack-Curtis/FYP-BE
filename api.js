const SerialPort = require("serialport");
const webSocket = require("./webSocket");
const errorMessage = require("./errorMessages");
const Readline = require("@serialport/parser-readline");
const json2csv = require("json2csv").parse;
const fs = require("fs");

var message = [];

async function getPortList() {
  return new Promise((resolve) => {
    SerialPort.list().then(
      (ports) => resolve(ports),
      (err) => resolve(err)
    );
  });
}

function createConnection(path, baudRate) {
  try {
    let port = new SerialPort(path, { baudRate: baudRate, autoOpen: false });
    let parser = port.pipe(new Readline({ delimiter: "\r\n" }));
    return { port, parser };
  } catch (err) {
    throw err;
  }
}

async function portConnect(port, imuId) {
  return new Promise((resolve) => {
    port.open(function (err) {
      if (err) {
        resolve(errorMessage.connectionError);
      }
      portWrite(port, imuId.toString());
      resolve(portWrite(port, "c"));
    });
  });
}

async function portWrite(port, message) {
  return new Promise((resolve) => {
    if (port.isOpen) {
      port.write(message, (err) => {
        if (err) {
          resolve(errorMessage.writeError);
        } else {
          resolve(errorMessage.writeSuccess);
        }
      });
    } else {
      resolve(errorMessage.portClosed);
    }
  });
}

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

function calibrate(port) {
  portWrite(port, "3");
}

function initListeners(parser, port) {
  port.on("error", (err) => {
    webSocket.broadcastData("An error occurred");
    throw err;
  });

  parser.on("data", (data) => {
    message.push(data);
    webSocket.broadcastData(data);
  });
}

function startStream(ports, paths) {
  try {
    paths.forEach((path) => {
      let port = ports[path];
      portWrite(port, "r");
    });
  } catch (err) {
    throw new Error(err);
  }
}

function stopStream(ports, paths) {
  try {
    paths.forEach((path) => {
      let port = ports[path];
      portWrite(port, "Stop");
    });
    saveData();
  } catch (err) {
    throw new Error(err);
  }
}

function saveData() {
  var csv = json2csv({ message });
  let fileName = `DATA-${getDateTime()}.csv`;
  fs.writeFile(fileName, csv, function (err) {
    if (err) throw err;
    console.log("File saved");
  });
}

// Taken from https://usefulangle.com/post/187/nodejs-get-date-time
function getDateTime() {
  let date_ob = new Date();

  // current date
  // adjust 0 before single digit date
  let date = ("0" + date_ob.getDate()).slice(-2);

  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  // current year
  let year = date_ob.getFullYear();

  // current hours
  let hours = date_ob.getHours();

  // current minutes
  let minutes = date_ob.getMinutes();

  // current seconds
  let seconds = date_ob.getSeconds();

  return `${date}-${month}-${year}-${hours}${minutes}${seconds}`;
}

module.exports = {
  getPortList,
  createConnection,
  portConnect,
  portDisconnect,
  startStream,
  calibrate,
  initListeners,
  stopStream,
};
