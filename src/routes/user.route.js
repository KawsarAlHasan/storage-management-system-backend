const express = require("express");
const {
  signupUser,
  loginUser,
  getMyProfile,
  updateProfile,
  changePassword,
  deleteUserAccount,
} = require("../controllers/user.controller");

const varifyToken = require("../middleware/verify.user.token");

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.get("/my-profile", varifyToken, getMyProfile);
router.patch("/update-profile", varifyToken, updateProfile);
router.patch("/change-password", varifyToken, changePassword);
router.delete("/delete-my-account", varifyToken, deleteUserAccount);

module.exports = router;
