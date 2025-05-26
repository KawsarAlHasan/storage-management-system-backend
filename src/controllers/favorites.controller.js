const Favorite = require("../models/favorites.model");
const File = require("../models/file.model");
const Folder = require("../models/folder.model");

// add to favorites
exports.addToFavorites = async (req, res) => {
  try {
    const userId = req.decodedUser._id;
    const { itemId, itemType } = req.body;

    if (!itemId || !itemType || !["File", "Folder"].includes(itemType)) {
      return res.status(400).json({
        success: false,
        error: "Invalid request. Provide itemId and itemType (File/Folder)",
      });
    }

    let item;
    if (itemType === "File") {
      item = await File.findOne({ _id: itemId, user: userId });
    } else {
      item = await Folder.findOne({ _id: itemId, user: userId });
    }

    if (!item) {
      return res.status(404).json({
        success: false,
        error: "Item not found or you do not own this item",
      });
    }

    const favorite = await Favorite.create({
      user: userId,
      item: itemId,
      itemType,
    });

    res.status(201).json({
      success: true,
      message: "Item added to favorites",
      data: favorite,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: "This item is already in your favorites",
      });
    }
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// remove from favorites
exports.removeFromFavorites = async (req, res) => {
  try {
    const userId = req.decodedUser._id;
    const { id } = req.params;

    const favorite = await Favorite.findOneAndDelete({
      _id: id,
      user: userId,
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        error: "Favorite item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Item removed from favorites",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// get user favorites
exports.getUserFavorites = async (req, res) => {
  try {
    const userId = req.decodedUser._id;

    const favorites = await Favorite.find({ user: userId })
      .populate({
        path: "item",
        select: "name type size path createdAt updatedAt",
        options: { lean: true },
      })
      .sort({ createdAt: -1 });

    const formattedFavorites = favorites.map((fav) => ({
      ...fav.toObject(),
      item: {
        ...fav.item,
        isFile: fav.itemType === "File",
        isFolder: fav.itemType === "Folder",
      },
    }));

    res.status(200).json({
      success: true,
      message: "Favorites retrieved successfully",
      data: formattedFavorites,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
