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
    lockPassword: { type: String },
    isLock: { type: Boolean, default: false },
    failedAttempts: { type: Number, default: 0 },
    lockedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("File", fileSchema);
