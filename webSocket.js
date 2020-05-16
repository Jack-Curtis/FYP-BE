var connections = new Array();

function handleConnection(client) {
  // client.send("Connection established");
  connections.push(client);

  client.on("message", function (data) {
    console.log(data);
  });

  client.on("close", function () {
    console.log("connection closed");
    var position = connections.indexOf(client);
    connections.splice(position, 1);
  });
}

function broadcastData(data) {
  for (myConnection in connections) {
    connections[myConnection].send(data);
  }
}

module.exports = {
  broadcastData,
  handleConnection,
};
