const express = require("express");
const router = express.Router();
const {
  addToFavorites,
  removeFromFavorites,
  getUserFavorites,
} = require("../controllers/favorites.controller");
const verifyToken = require("../middleware/verify.user.token");

router.post("/add", verifyToken, addToFavorites);
router.delete("/:id", verifyToken, removeFromFavorites);
router.get("/", verifyToken, getUserFavorites);

module.exports = router;
