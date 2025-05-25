const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: path.join(__dirname, "public/files"),
  filename: function (req, file, cb) {
    const originalName = path.basename(
      file.originalname,
      path.extname(file.originalname)
    );
    const ext = path.extname(file.originalname);
    const cleanName = originalName.replace(/\s+/g, "-");

    const uniqueSuffix =
      Date.now().toString(36).substr(-6) +
      Math.random().toString(36).substr(2, 3);

    const finalName = `${cleanName}-${uniqueSuffix}${ext}`;
    cb(null, finalName);
  },
});

const fillUploader = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 1024, // 1GB
  },
});

module.exports = fillUploader;
