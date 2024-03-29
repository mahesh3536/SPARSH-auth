require("dotenv").config();
const express = require("express");
const cors = require("cors");
const protect = require("./middleware/protect");
const app = express();
app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// app.use(protect.decodeToken);

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
const campus_ambassador = require("./routes/campus_ambassador");
const user_info = require("./routes/user_info");
const events_admin = require("./routes/events-admin");
const news_post = require("./routes/news-api");
app.use("/api/events", events);
app.use("/api/campus_ambassador", campus_ambassador);
app.use("/api/userinfo", user_info);
app.use("/api/news-api", news_post);

app.use("/api/events-admin", events_admin);

app.listen(process.env.PORT, () => {
  console.log("Server is running on", process.env.PORT);
});
