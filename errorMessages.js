define("portBusy", "Port Busy");
define("alreadyOpen", "Port already open");
define("connectionError", "There was an error, could not open port");
define("writeError", "There was an error writing to the serial port");

define("disconnectError", "Could not disconnect");
define("portClosed", "Port Closed");
define("closeError", "Port Could not be closed");
define("noPort", "Cannot read property 'close' of undefined");
define("cannotGetPorts", "Cannot read the list of serial ports");

define("writeSuccess", "Successfully wrote to serial port");

function define(name, value) {
  Object.defineProperty(exports, name, {
    value: value,
    enumerable: true,
  });
}
