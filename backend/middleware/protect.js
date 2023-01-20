const admin = require("../config/firebase-config");
class Middleware {
  async decodeToken(req, res, next) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decodeValue = await admin.auth().verifyIdToken(token);
      if (decodeValue) {
        return next();
      }
      return res.json({ message: "Unauthorized access" });
    } catch (err) {
      return res.json({ message: "Internal Server Error" });
    }
  }
}

module.exports = new Middleware();
