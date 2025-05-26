const jwt = require("jsonwebtoken");
const LockedFolder = require("../models/locked.folder.model");
const dotenv = require("dotenv");
dotenv.config();

module.exports = async (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(" ")?.[1];
    if (!token) {
      return res.status(401).json({
        status: "Fail",
        error: "Please provide locked Files Access Token in header",
      });
    }

    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).send({ message: "Forbidden access" });
      }

      const folderAccessUserId = decoded.id;
      const userId = decoded.user;

      if (!folderAccessUserId || !userId) {
        return res
          .status(403)
          .send({ message: "Please provide locked Files Access Token" });
      }

      const lockedFolder = await LockedFolder.findOne({ user: userId });

      if (!lockedFolder) {
        return res.status(404).json({
          error: "lockedFolder not found. Please Login Again",
        });
      }

      req.decodedLockedFolder = lockedFolder;
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
