const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/v1/user", require("./routes/jwtauth"));
app.use("/v1/friends", require("./routes/friends"));

app.listen(5004, () => {
  console.log("Server is listening to port 5004");
});

process.on("uncaughtException", function (err) {
  console.error(new Date().toUTCString() + " uncaughtException:", err.message);
  console.error(err.stack);
  process.exit(1);
});

module.exports = app;
