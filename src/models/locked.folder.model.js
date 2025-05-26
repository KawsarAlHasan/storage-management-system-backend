const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const lockedFolderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // Each user has only one locked folder
    },
    password: {
      type: String,
      required: true,
      select: false, // Never return password in queries
    },
  },
  { timestamps: true }
);

// Password hashing before saving
lockedFolderSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare passwords
lockedFolderSchema.methods.comparePassword = async function (
  candidatePassword
) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("LockedFolder", lockedFolderSchema);
