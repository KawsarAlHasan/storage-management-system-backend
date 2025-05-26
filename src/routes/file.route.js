const express = require("express");
const {
  uploadFile,
  getAllFiles,
  getFileById,
  deleteFile,
  updateFile,
  getFilesByDate,
  toggleFileLock,
  duplicateFile,
} = require("../controllers/file.controller");
const verifyToken = require("../middleware/verify.user.token");
const fileUploader = require("../middleware/file.uploader");

const router = express.Router();

router.post("/upload", verifyToken, fileUploader.single("file"), uploadFile);
router.post("/:id/duplicate", verifyToken, duplicateFile);

router.get("/all", verifyToken, getAllFiles);
router.get("/search-by-date/:date", verifyToken, getFilesByDate);
router.get("/:id", verifyToken, getFileById);
router.put("/lock/:id", verifyToken, toggleFileLock);
router.put("/:id", verifyToken, updateFile);
router.delete("/:id", verifyToken, deleteFile);

module.exports = router;
