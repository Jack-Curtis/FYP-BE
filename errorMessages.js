define("portBusy", "Port Busy");
define("alreadyOpen", "Port already open");
define("connectionError", "There was an error, could not open port");

define("disconnectError", "Could not disconnect");
define("portClosed", "Port Closed");
define("noPort", "Cannot read property 'close' of undefined");

function define(name, value) {
  Object.defineProperty(exports, name, {
    value: value,
    enumerable: true
  });
}
