const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    name: String,
    type: { type: String, enum: ["image", "video", "pdf", "note"] },
    size: Number,
    path: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    folder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("File", fileSchema);
