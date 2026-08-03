const multer = require("multer");
const { storage } = require("../config/cloudconfig");

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf"]);
const uploadCloud = multer({
  storage,
  limits: { files: 10, fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, callback) => callback(null, allowedMimeTypes.has(file.mimetype)),
});

const uploadImage = (req, res, next) => {
  const upload = uploadCloud.array("certificates", 10);

  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.code === "LIMIT_FILE_SIZE" ? "Each file must be 5 MB or smaller" : err.message,
      });
    }

    next();
  });
};

module.exports = uploadImage;
