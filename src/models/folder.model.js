const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema(
  {
    name: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Folder", folderSchema);
