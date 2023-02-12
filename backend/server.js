require("dotenv").config()
const express = require("express");
const cors = require("cors");
const protect = require("./middleware/protect");
const app = express();
app.use(cors());
app.use(express.json());

app.use(protect.decodeToken);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/sendMail", (req, res) => {
  console.log("hello");
  res.send("hello");
  // console.log(req.body.email)

  // options.to = req.body.email;

  // transporter.sendMail(options , function (err , info) {
  //     if(err){
  //         console.log(err)
  //         res.status(400).send("NOT OK")
  //     }
  //     else {
  //         console.log("Send : "  , info.response)
  //         res.status(200).send("OK")
  //     }
  // })
});

const events = require("./routes/events");
app.use("/api/events", events);

app.listen(process.env.PORT, () => {
  console.log("Server is running on", process.env.PORT);
});
