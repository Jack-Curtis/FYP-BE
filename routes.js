"use strict";
const bodyParser = require("body-parser");
const SerialPort = require("serialport");
var WebSocketServer = require("ws").Server;
const Readline = require("@serialport/parser-readline");

const api = require("./api");
const errorMessage = require("./errorMessages");
const webSockettest = require("./webSockettest");

const baudRate = 9600;
var SERVER_PORT = 8080;
const ports = {};
const paths = [];
var parsers = {};
var wss = new WebSocketServer({ port: SERVER_PORT }); // the webSocket server
wss.on("connection", webSockettest.handleConnection);
// wss.on("message", () => console.log("MESSAGE RECEIVED"));
// wss.on("close", webSockettest.closeSocket);

module.exports = function (app) {
  app.use(bodyParser.json());

  app.get("/init", async (req, res) => {
    api.getPortList().then((portList) => res.send(portList)); // Change this to a http response code
  });

  // TODO: Add create parsers in her e
  app.post("/connect", async (req, res) => {
    const path = req.body.device;
    const port = new SerialPort(path, { baudRate: baudRate });
    var parser = port.pipe(new Readline({ delimiter: "\r\n" }));
    console.log("PAth=", path);
    paths.push(path);
    ports[path] = port;
    parsers[path] = parser;

    api.parseData(parsers[path]);

    console.log("About to connect");
    var response = await api
      .portConnect(ports[path], parsers[path], path)
      .catch(() => {
        response = errorMessage.connectionError;
      });

    if (response == errorMessage.portBusy) {
      delete ports[path];
      paths.pop();
    }
    res.send([response]); // Change this to a http response code
  });

  app.post("/calibrate", async (req, res) => {
    paths.forEach(async function (path) {
      var response = await api
        .calibrate(ports[path], parsers[path])
        .catch(() => {
          response = errorMessage.connectionError;
        });
    });
    // res.send([response]); // Change this to a http response code
  });

  app.post("/disconnect", async (req, res) => {
    console.log("Disconnecting IMU");
    const path = req.body.device;

    api.portDisconnect(ports[path]).then((response) => {
      if (response == errorMessage.portClosed) {
        delete ports[path];
      }

      res.send([response]); // Change this to a http response code
    });
  });

  // TODO: Send 4 to the IMU to get data back
  app.post("/collectdata", async (req, res) => {
    var response = await api.collectData(ports, paths, parsers).catch(() => {
      res.sendStatus(500);
    });
    res.status(200).send([response]); // Change this to a http response code
  });

  app.post("/stopdata", async (req, res) => {
    var response = await api.stopData(ports, paths, parsers).catch(() => {
      res.sendStatus(500);
    });
    res.status(200).send([response]); // Change this to a http response code
  });
};
