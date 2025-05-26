const express = require("express");
const router = express.Router();
const {
  accessLockedFolder,
  changeLockedFolderPassword,
  initializeLockedFolder,
  getLockedFileById,
} = require("../controllers/locked.folder.controller");
const folderVerifyToken = require("../middleware/verify.folder.access.token");
const verifyToken = require("../middleware/verify.user.token");

router.post("/set-password", verifyToken, initializeLockedFolder);
router.get("/access", folderVerifyToken, accessLockedFolder);
router.get("/:id", folderVerifyToken, getLockedFileById);
router.put("/change-password", verifyToken, changeLockedFolderPassword);

module.exports = router;
