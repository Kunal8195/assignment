/** External Dependencies **/
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');

//Setup DB connection
require('./db');

// Express App
const app = express();

// body-Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

app.use(function(err, req, res, next) {
  res.status(400).json(err);
  next();
});


// port and IP for server
const port = process.env.PORT || 3000;
const ip = process.env.IP || "127.0.0.1";

// server starts listening
app.listen(port, ip, function(error) {
  if (error) {
    throw error;
  }
  console.log(`Server on http://${ip}:${port}`);
});

// setup the Root route for the App
app.get('/', ( req, res ) => {
	res.send('Welcome! The App is Working Fine');
})

// Mount the Routes
require("./Routes")(app);

// Export the express app instance
module.exports = app;