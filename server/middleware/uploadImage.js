const multer = require("multer");
const { storage } = require("../config/cloudconfig");

const uploadCloud = multer({ storage });

const uploadImage = (req, res, next) => {
  const upload = uploadCloud.array("certificates", 10);

  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    next();
  });
};

module.exports = uploadImage;