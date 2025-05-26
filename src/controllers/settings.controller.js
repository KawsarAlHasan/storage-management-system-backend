const Setting = require("../models/settings.model");

// Get static content
exports.getStaticContent = async (req, res) => {
  try {
    const { type } = req.params;

    // Validate the requested type
    if (!["about", "privacy", "terms"].includes(type)) {
      return res.status(400).json({
        success: false,
        error: "Invalid content type. Must be 'about', 'privacy', or 'terms'",
      });
    }

    // Find the content in database
    const content = await Setting.findOne({ type });

    if (!content) {
      return res.status(404).json({
        success: false,
        error: `${type} content not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: `${type} content retrieved successfully`,
      data: {
        name: content.name,
        content: content.content,
        lastUpdated: content.updatedAt,
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

// update static content
exports.updateSetting = async (req, res) => {
  try {
    const { type, content, name } = req.body;

    if (!["about", "privacy", "terms"].includes(type)) {
      return res.status(400).json({
        success: false,
        error: "Invalid content type. Must be 'about', 'privacy', or 'terms'",
      });
    }

    const updated = await Setting.findOneAndUpdate(
      { type },
      { content, name },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: `${type} content updated successfully`,
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
