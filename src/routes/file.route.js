const express = require("express");
const {
  uploadFile,
  getAllFiles,
  getFileById,
  deleteFile,
  updateFile,
  getFilesByDate,
} = require("../controllers/file.controller");
const varifyToken = require("../middleware/verify.user.token");
const fileUploader = require("../middleware/file.uploader");

const router = express.Router();

router.post("/upload", varifyToken, fileUploader.single("file"), uploadFile);

router.get("/all", varifyToken, getAllFiles);
router.get("/search-by-date/:date", varifyToken, getFilesByDate);
router.get("/:id", varifyToken, getFileById);
router.put("/:id", varifyToken, updateFile);
router.delete("/:id", varifyToken, deleteFile);

module.exports = router;
