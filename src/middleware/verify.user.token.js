const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const dotenv = require("dotenv");
dotenv.config();

module.exports = async (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(" ")?.[1];
    if (!token) {
      return res.status(401).json({
        status: "Fail",
        error: "You are not loggedin",
      });
    }

    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).send({ message: "Forbidden access" });
      }

      const id = decoded.id;
      const user = await User.findOne({ _id: id });

      if (!user) {
        return res.status(404).json({
          error: "User not found. Please Login Again",
        });
      }

      req.decodedUser = user;
      next();
    });
  } catch (error) {
    res.status(403).json({
      status: "Fail",
      message: "Invalid Token",
      error: error.message,
    });
  }
};
