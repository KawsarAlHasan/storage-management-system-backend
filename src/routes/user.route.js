const express = require("express");
const {
  signupUser,
  loginUser,
  getMyProfile,
  updateProfile,
  changePassword,
  deleteUserAccount,
  getMyDashboard,
} = require("../controllers/user.controller");

const varifyToken = require("../middleware/verify.user.token");
const fileUploader = require("../middleware/file.uploader");

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.get("/my-profile", varifyToken, getMyProfile);
router.get("/my-dashboard", varifyToken, getMyDashboard);
router.patch(
  "/update-profile",
  varifyToken,
  fileUploader.single("profilePicture"),
  updateProfile
);
router.patch("/change-password", varifyToken, changePassword);
router.delete("/delete-my-account", varifyToken, deleteUserAccount);

module.exports = router;
