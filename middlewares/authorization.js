const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req, res, next) => {
  try {
    const jwtToken = req.header("token");

    let message = "";
    if (!jwtToken) {
      message = "You are not authorised";
      res.status(403).send({ error: true, data: null, message: message });
    } else {
      const payload = jwt.verify(jwtToken, process.env.jwtSecret);

      req.user = payload.user;
      next();
    }
  } catch (err) {
    console.error(err.message);
    res.status(403).json("Not Authorised");
  }
};
