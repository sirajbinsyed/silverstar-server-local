const express = require('express');
const {
  getRestaurants,
  getRestaurant,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant
} = require('../controllers/restaurantController');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/restaurants
router.get('/', getRestaurants);

// @route   GET /api/restaurants/:id
router.get('/:id', getRestaurant);

// @route   POST /api/restaurants
router.post('/', auth, createRestaurant);

// @route   PUT /api/restaurants/:id
router.put('/:id', auth, updateRestaurant);

// @route   DELETE /api/restaurants/:id
router.delete('/:id', auth, deleteRestaurant);

module.exports = router;
