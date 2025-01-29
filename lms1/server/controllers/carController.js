const Car = require('../models/Car');
const { uploadImageToCloudinary } = require('../utils/cloudinary');
const uploadCarImage = async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const image = req.files.image;

    // Ensure temp files are enabled in express-fileupload
    const result = await uploadImageToCloudinary(image, "cars");

    res.json({ imageUrl: result.secure_url }); // Return Cloudinary URL
  } catch (error) {
    console.error("Error uploading image1:", error);
    res.status(500).json({ message: "Error uploading image2", error });
  }
};

const createCar = async (req, res) => {
  try {
    const { title, description, tags, images } = req.body; // Accept images as URLs from frontend

    if (Array.isArray(images) && images.length > 10) {
      return res.status(400).json({ message: "Maximum 10 images allowed" });
    }

    const car = new Car({
      title,
      description,
      tags,
      images, // Use URLs sent from frontend
      userId: req.user.userId,
    });

    await car.save();
    res.status(201).json({ message: "Car created successfully", car });
  } catch (error) {
    console.error("Error creating car:", error);
    res.status(500).json({ message: "Error creating car", error });
  }
};


const getCars = async (req, res) => {
  try {
    const cars = await Car.find({ userId: req.user.userId });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cars', error });
  }
};

const getCarById = async (req, res) => {
  try {
    const car = await Car.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!car) return res.status(404).json({ message: 'Car not found' });
    res.json(car);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching car', error });
  }
};

const updateCar = async (req, res) => {
  try {
 
    const { title, description, tags } = req.body;
    console.log(title);
    console.log(description);
    console.log(tags);
  
    const images = req.files?.images;
console.log(images);
    if (images && images.length > 10) {
      return res.status(400).json({ message: 'Maximum 10 images allowed' });
    }

    const uploadedImages = [];
    if (images) {
      for (const image of Array.isArray(images) ? images : [images]) {
        const result = await uploadImageToCloudinary(image.tempFilePath, 'cars');
        uploadedImages.push(result.secure_url);
      }
    }

    const existingCar = await Car.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!existingCar) {
      return res.status(404).json({ message: 'Car not found' });
    }

    const finalImages = uploadedImages.length > 0 ? uploadedImages : existingCar.images;

    const updateData = { title, description, tags, images: finalImages };

    const car = await Car.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      updateData,
      { new: true }
    );

    res.json({ message: 'Car updated successfully', car });
  } catch (error) {
    console.error('Error updating car:', error);
    res.status(500).json({ message: 'Error updating car', error });
  }
};



const deleteCar = async (req, res) => {
  try {
    // Check if car exists
    const car = await Car.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!car) return res.status(404).json({ message: 'Car not found' });

    // Delete the car
    await Car.deleteOne({ _id: req.params.id, userId: req.user.userId });

    res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    console.error('Error deleting car:', error);
    res.status(500).json({ message: 'Error deleting car', error });
  }
};


const searchCars = async (req, res) => {
  try {
    const { keyword } = req.query;
    const cars = await Car.find({
      userId: req.user.userId,
      $or: [
        { title: { $regex: keyword, $options: 'i' } } ,
        { description: { $regex: keyword, $options: 'i' } },
        { tags: { $regex: keyword, $options: 'i' } },
      ],
    });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: 'Error searching cars', error });
  }
};

module.exports = {
  createCar,
  getCars,
  getCarById,
  updateCar,
  deleteCar,
  searchCars,
  uploadCarImage
};