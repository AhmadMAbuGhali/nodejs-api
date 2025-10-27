const Image = require("../models/Image");
const { uploadToCloudinary } = require("../helpers/cloudinaryHelper");
const cloudinary =  require('../config/cloudinary')
// Controller to handle image upload
const uploadImageController = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "No file uploaded", success: false });
    }

    // upload image to Cloudinary
    const { url, publicId } = await uploadToCloudinary(req.file.path);

    // store image info in database
    const newImage = new Image({
      url,
      publicId,
      description: req.body.description || "",
      uploadedBy: req.userInfo.userId,
    });

    await newImage.save();

    //delete the file from local uploads folder after uploading to cloudinary
    // const fs = require("fs");
    // fs.unlinkSync(req.file.path);

    res
      .status(201)
      .json({
        message: "Image uploaded successfully",
        image: newImage,
        success: true,
      });
  } catch (error) {
    console.error("Image upload error:", error);
    res
      .status(500)
      .json({ message: "Server error during image upload", success: false });
  }
};

// get all images controller can be added here in future

const fletchAllImages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page -1) * limit;


    const sortBy = req.query.sortBy || 'createdAt';

    const sortOrder = req.query.sortOrder == 'asc' ? 1 : -1;

    const totalImage = await Image.countDocuments();

    const totalPage = Math.ceil(totalImage/limit)

    const sortObj = {};
    sortObj[sortBy] = sortOrder;

    const images = await Image.find().sort(sortObj).skip(skip).limit(limit);

    res.status(200).json({
      success: true ,
      curruntPage : page,
      totalPage : totalPage,
      totalImage: totalImage,
      data: images, 

    });
  } catch (error) {
    console.error("Error fetching images:", error);
    res
      .status(500)
      .json({ message: "Server error fetching images", success: false });
  }
};


const deleteImageController = async (req, res) => {
  try{

    const getCurrentIdOfImageToBeDeleted = req.params.id;
    const userId = req.userInfo.userId;

    const image = await Image.findById(getCurrentIdOfImageToBeDeleted)

    if(!image){
      return res.status(404).json({
        success:false,
        message:"image not found"
      })
    }

    // check if this image is uploaded bu currunt user  who try to delete image 
    if(image.uploadedBy.toString() !== userId){

      return res.status(403).json({
        success:false,
        message: "you are not authorize to delete this image "
      })
    }

    // delete the image from cloudinary storage 
   await cloudinary.uploader.destroy(image.publicId)

   // delete image from mongoodb

   await Image.findByIdAndUpdate(getCurrentIdOfImageToBeDeleted)

   res.status(200).json({
    success:true,
    message: 'Image deleted <3 '
   })

  }catch(error){
    console.error("Error fetching images:", error);
    res
      .status(500)
      .json({ message: "Server error fetching images", success: false });
  
  }

}

module.exports = { uploadImageController , fletchAllImages, deleteImageController};
