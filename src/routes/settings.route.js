const express = require("express");
const {
  getStaticContent,
  updateSetting,
} = require("../controllers/settings.controller");
const router = express.Router();

// Get static content by type
router.get("/:type", getStaticContent);
router.put("/update", updateSetting);

module.exports = router;
