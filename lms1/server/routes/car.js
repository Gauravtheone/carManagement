const express = require('express');
const {
  createCar,
  getCars,
  getCarById,
  updateCar,
  deleteCar,
  searchCars,uploadCarImage
} = require('../controllers/carController');
const { authenticate } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authenticate, createCar);
router.get('/', authenticate, getCars);
router.get('/:id', authenticate, getCarById);
router.put('/:id', authenticate, updateCar);
router.delete('/:id', authenticate, deleteCar);
router.get('/search', authenticate, searchCars);
router.post("/upload", authenticate, uploadCarImage); // Ensure authentication before uploading

module.exports = router;