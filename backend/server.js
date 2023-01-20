const express = require("express");
const cors = require("cors");
const protect = require("./middleware/protect");
const app = express();
app.use(cors());
const PORT = 5000;

app.use(protect.decodeToken);

app.get("/api/hello", (req, res) => {
  return res.json({ message: "Hello WOrld" });
});

app.listen(PORT, () => {
  console.log("Server is running");
});
