const Folder = require("../models/folder.model");
const File = require("../models/file.model");

// Create a new folder
exports.createFolder = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(401).json({
        success: false,
        error: "Please provide name field in body",
      });
    }

    const userId = req?.decodedUser?._id;

    const existingFolder = await Folder.findOne({ name, user: userId });

    if (existingFolder) {
      return res.status(409).json({
        success: false,
        error: "A folder with this name already exists for this user",
      });
    }

    const newFolder = new Folder({
      name,
      user: userId,
    });

    const savedFolder = await newFolder.save();
    res.status(201).json({
      success: true,
      message: "Folder created successfully",
      data: savedFolder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Get all folders for a user
exports.getAllFolders = async (req, res) => {
  try {
    const userId = req?.decodedUser?._id;

    const folders = await Folder.find({ user: userId });

    if (folders.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No folders found for this user",
      });
    }

    res.status(200).json({
      success: true,
      message: "Get all folders successfully",
      data: folders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Get a single folder by ID
exports.getFolderById = async (req, res) => {
  try {
    const { id } = req.params;

    const folder = await Folder.findById(id).lean();

    if (!folder) {
      return res.status(404).json({
        success: false,
        error: "Folder not found",
      });
    }

    const files = await File.find({ folder: id })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      message: "Get folder by ID successfully",
      data: {
        ...folder,
        files: files,
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

// Update a folder
exports.updateFolder = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const updatedFolder = await Folder.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!updatedFolder) {
      return res.status(404).json({ error: "Folder not found" });
    }

    res.status(200).json({
      success: true,
      message: "Folder updated successfully",
      data: updatedFolder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Delete a folder
exports.deleteFolder = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Folder.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: "Folder not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Folder deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
