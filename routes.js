"use strict";
const bodyParser = require("body-parser");
// const SerialPort = require("serialport");
// const Readline = require("@serialport/parser-readline");
var WebSocketServer = require("ws").Server;

const api = require("./api");
const webSocket = require("./webSocket");
const errorMessage = require("./errorMessages");

const baudRate = 9600;
var SERVER_PORT = 8080;
const ports = {};
const paths = [];
const parsers = {};
var wss = new WebSocketServer({ port: SERVER_PORT }); // the webSocket server
wss.on("connection", webSocket.handleConnection);

module.exports = function (app) {
  app.use(bodyParser.json());

  app.get("/getports", async (req, res) => {
    api.getPortList().then((portList) => res.send(portList));
  });

  app.post("/connect", async (req, res) => {
    let path = req.body.device;
    let { port, parser } = api.createConnection(path, baudRate);

    paths.push(path);
    ports[path] = port;
    parsers[path] = parser;

    api.parseData(parser, port);
    await api
      .portConnect(port, Object.keys(ports).length - 1)
      .then((response) => {
        if (response == errorMessage.connectionError) {
          res.status(500).send([response]);
        } else {
          res.status(200).send([response]);
        }
      });
  });

  app.post("/calibrate", async () => {
    paths.forEach((path) => {
      api.calibrate(ports[path], parsers[path]);
    });
  });

  app.post("/disconnect", async (req, res) => {
    console.log("Disconnecting IMU");
    const path = req.body.device;

    await api.portDisconnect(ports[path]).then((response) => {
      console.log(response);
      if (response == errorMessage.portClosed) {
        delete ports[path];
        delete parsers[path];
        res.status(200).send([response]);
      } else {
        res.status(500).send([response]);
      }
    });
  });

  app.post("/startstream", async (req, res) => {
    api.startStream(ports, paths);
  });

  app.post("/stopstream", async (req, res) => {
    api.stopStream(ports, paths);
  });
};
