const express = require("express");
const bodyParser = require("body-parser");
const InitiateMongoServer = require("./config/db");
const user = require("./routes/user");
const { spawn } = require("child_process");

InitiateMongoServer();

const app = express();
const PORT = process.env.PORT || 3333;

app.use(bodyParser.json());

app.use("/user", user);

app.get("/", (req, res) => {
  var dataToSend;
  // spawn new child process to call the python script
  const python = spawn("python", ["economistAPI.py"]);
  // collect data from script
  python.stdout.on("data", function (data) {
    console.log("Pipe data from python script ...");
    dataToSend = data.toString();
  });
  // in close event we are sure that stream from child process is closed
  python.on("close", (code) => {
    console.log(`child process close all stdio with code ${code}`);
    // send data to browser

    res.send(dataToSend);
  });
});
app.listen(PORT, () => {
  console.warn(`App listening on http://localhost:${PORT}`);
});
