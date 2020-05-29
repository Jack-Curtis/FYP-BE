var express = require("express"),
  app = express(),
  port = 3001;

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.listen(port);

console.log("RESTful API server started on: " + port);

var routes = require("./routes/routes.js"); //importing route
routes(app); //register the route
