var message = [];

function startStream(ports, paths) {
  try {
    paths.forEach((path) => {
      let port = ports[path];
      writeToPort(port, "r");
    });
  } catch (err) {
    throw new Error(err);
  }
}

function stopStream(ports, paths) {
  try {
    paths.forEach((path) => {
      let port = ports[path];
      writeToPort(port, "Stop");
    });
    saveData();
  } catch (err) {
    throw new Error(err);
  }
}
