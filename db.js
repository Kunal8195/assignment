// Bring Mongoose into the app
const mongoose = require("mongoose");

// Build the connection string
// used the hardcoded string can be stroed in environment variables
const dbURI = "mongodb://localhost/assignment";


// Create the database connection
mongoose.connect(dbURI, err => {
  if (err) {
    throw err;
  } else {
    console.log('MongoDB connected');
  }
});

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on("connected", function() {
  console.log("Mongoose default connection open to " + dbURI);
});

// If the connection throws an error
mongoose.connection.on("error", function(err) {
  console.log("Mongoose default connection error: " + err);
});

// When the connection is disconnected
mongoose.connection.on("disconnected", function() {
  console.log("Mongoose default connection disconnected");
});