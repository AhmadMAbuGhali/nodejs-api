const express = require("express");
const router = express.Router();
const { uploadImage } = require("../controllers/image-controller");
const { authenticateUser } = require("../middleware/auth-middleware");
const multer = require("multer");
const authMiddleware = require("../middleware/auth-middleware");
const adminMiddeware = require("../middleware/admin-middelware");
const uploadMiddelware = require("../middleware/upload-middelware");
const {
  uploadImageController,
  fletchAllImages,
  deleteImageController
} = require("../controllers/image-controller"); // configure multer to save files to 'uploads/' directory

// Route to handle image upload
router.post(
  "/upload",
  authMiddleware,
  adminMiddeware,
  uploadMiddelware.single("image"),
  uploadImageController
);

//get all images route can be added here in future
router.get(
  "/allImage",
  authMiddleware,
  adminMiddeware,
  fletchAllImages,
  async (req, res) => {
      try {
        const images = await Image.find({ uploadedBy: req.userInfo.userId });
        res.status(200).json({ images, success: true });
      } catch (error) {
        console.error("Error fetching images:", error);
        res
          .status(500)
          .json({ message: "Server error fetching images", success: false });
      }
  }
);

// delete image route
//ryszw8fsi6pr3wufydfy

router.delete('/:id',authMiddleware,adminMiddeware,deleteImageController)

module.exports = router;
