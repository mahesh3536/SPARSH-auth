const express = require("express");
const cors = require("cors");
const protect = require("./middleware/protect");
const app = express();
app.use(cors());
const PORT = 5000;

// app.use(protect.decodeToken);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post('/sendMail' , (req , res) => {

  console.log('hello')
  res.send('hello')
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
})

app.use('/api', require('./routes/index'));

app.listen(PORT, () => {
  console.log("Server is running");
});
