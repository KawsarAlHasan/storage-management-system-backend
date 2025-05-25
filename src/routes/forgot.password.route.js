const express = require("express");
const {
  sendResetCode,
  verifyResetCode,
  newPasswordSet,
} = require("../controllers/forgot.password.controller");

const router = express.Router();

router.post("/send-reset-code", sendResetCode);
router.post("/verify-reset-code", verifyResetCode);
router.post("/new-password", newPasswordSet);

module.exports = router;
