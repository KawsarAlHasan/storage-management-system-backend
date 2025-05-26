const LockedFolder = require("../models/locked.folder.model");
const File = require("../models/file.model");
const { generateLockedToken } = require("../config/locked.file.token");

// set password for first time
exports.initializeLockedFolder = async (req, res) => {
  try {
    const userId = req.decodedUser._id;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 6 characters",
      });
    }

    const lockedFolder = await LockedFolder.findOne({ user: userId }).select(
      "+password"
    );

    if (lockedFolder) {
      return res.status(404).json({
        success: false,
        error: "Locked folder already exists",
      });
    }

    const LockedFolderData = await LockedFolder.create({
      user: userId,
      password,
    });

    const lockedFilesAccessToken = generateLockedToken(LockedFolderData);

    res.status(200).json({
      success: true,
      message: "Locked folder password set successfully",
      data: {
        lockedFilesAccessToken: lockedFilesAccessToken,
        LockedFolderData,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Access locked folder
exports.accessLockedFolder = async (req, res) => {
  try {
    const decodedLocked = req.decodedLockedFolder;

    // Get all locked files
    const lockedFiles = await File.find({
      user: decodedLocked.user,
      isLock: true,
    }).populate("folder");

    res.status(200).json({
      success: true,
      message: "Locked folder accessed successfully",
      data: lockedFiles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Change locked folder password
exports.changeLockedFolderPassword = async (req, res) => {
  try {
    const userId = req.decodedUser._id;
    const { currentPassword, newPassword } = req.body;

    const lockedFolder = await LockedFolder.findOne({ user: userId }).select(
      "+password"
    );

    if (!lockedFolder) {
      return res.status(404).json({
        success: false,
        error: "Locked folder not found",
      });
    }

    const isMatch = await lockedFolder.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Current password is incorrect",
      });
    }

    lockedFolder.password = newPassword;
    const result = await lockedFolder.save();

    const lockedFilesAccessToken = generateLockedToken(result);

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
      data: {
        lockedFilesAccessToken: lockedFilesAccessToken,
        LockedFolderData: result,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Get a single locked file by ID
exports.getLockedFileById = async (req, res) => {
  try {
    const { id } = req.params;
    const file = await File.findById(id).populate("folder");

    if (!file) {
      return res.status(404).json({
        success: false,
        error: "File not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Get file by ID successfully",
      data: file,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
