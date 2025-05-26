const File = require("../models/file.model");
const fs = require("fs");
const path = require("path");
const User = require("../models/user.model");

// Upload a new file
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No file uploaded",
      });
    }

    const { originalname, mimetype, size, filename } = req.file;

    const userId = req.decodedUser._id;

    // Check user's storage limit
    const user = await User.findById(userId);
    if (user.storageUsed + size > user.storageLimit) {
      return res.status(400).json({
        success: false,
        error: "Storage limit exceeded",
      });
    }

    // Determine file type based on mimetype
    let fileType;
    if (mimetype.startsWith("image/")) {
      fileType = "image";
    } else if (mimetype.startsWith("video/")) {
      fileType = "video";
    } else if (mimetype === "application/pdf") {
      fileType = "pdf";
    } else if (mimetype.startsWith("text/")) {
      fileType = "note";
    } else {
      fileType = "other";
    }

    const pathUrl = `${req.protocol}://${req.get(
      "host"
    )}/public/files/${filename}`;

    const newFile = new File({
      name: originalname,
      type: fileType,
      size: size,
      path: pathUrl,
      user: userId,
      folder: req.body.folderId || null,
      lockPassword: req.body.lockPassword || null,
      isLock: req.body.isLock || false,
    });

    const savedFile = await newFile.save();

    // Update user's storage used
    await User.findByIdAndUpdate(
      userId,
      {
        $inc: {
          storageUsed: size,
          storageAvailable: -size,
        },
      },
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: "File uploaded successfully",
      data: savedFile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Get all files for a user
exports.getAllFiles = async (req, res) => {
  try {
    const userId = req.decodedUser._id;
    const { folderId, type, name } = req.query;

    const query = { user: userId };
    if (folderId) query.folder = folderId;
    if (type) query.type = type;
    if (name) query.name = name;

    const files = await File.find(query).populate("folder");

    if (files.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No files found for this user",
      });
    }

    res.status(200).json({
      success: true,
      message: "Get all files successfully",
      data: files,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.getFilesByDate = async (req, res) => {
  try {
    const userId = req.decodedUser._id;
    const { date } = req.params;

    if (!date) {
      return res.status(400).json({
        success: false,
        error: "Date parameter is required (format: YYYY-MM-DD)",
      });
    }

    const searchDate = new Date(date);
    if (isNaN(searchDate.getTime())) {
      return res.status(400).json({
        success: false,
        error: "Invalid date format. Please use YYYY-MM-DD format",
      });
    }

    const startDate = new Date(searchDate);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(searchDate);
    endDate.setHours(23, 59, 59, 999);

    const files = await File.find({
      user: userId,
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    }).populate("folder");

    if (files.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No files found for date ${date}`,
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: `Files retrieved for date ${date}`,
      data: files,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Get a single file by ID
exports.getFileById = async (req, res) => {
  try {
    const { id } = req.params;
    const file = await File.findById(id).populate("folder");
    const lockPassword = req.query.lockPassword;

    if (!file) {
      return res.status(404).json({
        success: false,
        error: "File not found",
      });
    }

    if (file.isLock === true && !lockPassword) {
      return res.status(403).json({
        success: false,
        error:
          "File is locked. Please provide the lockPassword query parameter.",
      });
    }

    if (file.lockPassword !== lockPassword) {
      return res.status(403).json({
        success: false,
        error: "Invalid lockPassword",
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

// Delete a file
exports.deleteFile = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.decodedUser._id;

    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({
        success: false,
        error: "File not found",
      });
    }

    const fileName = file.path.split("/").pop();
    const filePath = path.join(__dirname, "../../public/files", fileName);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await File.findByIdAndDelete(id);

    await User.findByIdAndUpdate(
      userId,
      {
        $inc: {
          storageUsed: -file.size,
          storageAvailable: file.size,
        },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "File deleted successfully",
      deletedFileSize: file.size,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Update file information (mainly for changing folder)
exports.updateFile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const updatedFile = await File.findByIdAndUpdate(
      id,
      { name: name },
      { new: true }
    ).populate("folder");

    if (!updatedFile) {
      return res.status(404).json({
        success: false,
        error: "File not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "File updated successfully",
      data: updatedFile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
