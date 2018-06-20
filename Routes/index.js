module.exports = function(app) {
  require("./userRoute")(app);
  require("./socialRoutes")(app);
  require("./otpVerificationRoutes")(app);
};
