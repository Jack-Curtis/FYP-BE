"use strict";
const bodyParser = require("body-parser");
var WebSocketServer = require("ws").Server;

// Import controllers
const connectionController = require("../controllers/connectionController");
const disconnectionController = require("../controllers/disconnectionController");
const startStreamController = require("../controllers/startStreamController");
const stopStreamController = require("../controllers/stopStreamController");
const getPortListController = require("../controllers/getPortListController");

// Import all the utilities
const webSocket = require("../utilities/webSocket");
const errorMessages = require("../errorMessages");
const constants = require("../constants");

var devices = [];

var wss = new WebSocketServer({ port: constants.SERVER_PORT });
wss.on("connection", webSocket.handleConnection);

module.exports = function (app) {
  app.use(bodyParser.json());

  app.get("/getports", async (req, res) => {
    let response = await getPortListController.getPortListController();

    response === errorMessages.cannotGetPorts
      ? res.status(500).send(response)
      : res.status(200).send(response);
  });

  app.post("/connect", async (req, res) => {
    let path = req.body.device;
    let response = await connectionController.connectionController(
      path,
      devices
    );

    if (response === errorMessages.connectionError) {
      res.status(500).send([response]);
    } else {
      devices[path] = { port: response.port, parser: response.parser };
      res.status(200).send(["Success"]);
    }
  });

  app.post("/disconnect", async (req, res) => {
    let path = req.body.device;
    let response = await disconnectionController.disconnectionController(
      devices[path]
    );

    if (response === errorMessages.portClosed) {
      delete devices[path];
      res.status(200).send([response]);
    } else {
      res.status(500).send([response]);
    }
  });

  app.post("/startstream", async (req, res) => {
    let response = await startStreamController.startStreamController(devices);
    console.log(response);

    response === errorMessages.writeSuccess
      ? res.status(200).send([response])
      : res.status(500).send([response]);
  });

  app.post("/stopstream", async (req, res) => {
    let response = await stopStreamController.stopStreamController(devices);
    console.log(response);

    response === errorMessages.writeSuccess
      ? res.status(200).send([response])
      : res.status(500).send([response]);
  });
};
