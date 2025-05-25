const express = require("express");

const {
  createFolder,
  getAllFolders,
  getFolderById,
  updateFolder,
  deleteFolder,
} = require("../controllers/folder.controller");
const varifyToken = require("../middleware/verify.user.token");

const router = express.Router();

router.post("/create", varifyToken, createFolder);
router.get("/all", varifyToken, getAllFolders);
router.get("/:id", getFolderById);
router.put("/:id", varifyToken, updateFolder);
router.delete("/:id", varifyToken, deleteFolder);

module.exports = router;
