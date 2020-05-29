"use strict";
const bodyParser = require("body-parser");
var WebSocketServer = require("ws").Server;

const api = require("../api");
const constants = require("../constants");
const portListService = require("../services/portListService");
const connectionController = require("../controller/connectionController");
const webSocket = require("../utilities/webSocket");
const errorMessages = require("../errorMessages");

var ports = {};
var paths = [];
var parsers = {};

var wss = new WebSocketServer({ port: constants.SERVER_PORT }); // the webSocket server
wss.on("connection", webSocket.handleConnection);

module.exports = function (app) {
  app.use(bodyParser.json());

  app.get("/getports", async (req, res) => {
    portListService.getPortList().then((portList) => res.send(portList));
  });

  app.post("/connect", async (req, res) => {
    let path = req.body.device;
    let response = await connectionController.connectionController(path, paths);

    if (response === errorMessages.connectionError) {
      res.status(500).send([response]);
    } else {
      paths.push(path);
      ports[path] = response.port;
      parsers[path] = response.parser;
      res.status(200).send(["Success"]);
    }
  });

  app.post("/calibrate", async () => {
    paths.forEach((path) => {
      calibrate(ports[path], parsers[path]);
    });
  });

  app.post("/disconnect", async (req, res) => {
    console.log("Disconnecting IMU");
    let path = req.body.device;

    await portDisconnect(ports[path]).then((response) => {
      console.log(response);
      if (response == portClosed) {
        delete ports[path];
        delete parsers[path];
        res.status(200).send([response]);
      } else {
        res.status(500).send([response]);
      }
    });
  });

  app.post("/startstream", async (req, res) => {
    startStream(ports, paths);
  });

  app.post("/stopstream", async (req, res) => {
    stopStream(ports, paths);
  });
};
