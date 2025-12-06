
const express = require('express');
const router = express.Router();
const { 
  getRestaurants, 
  getFoods, 
  createRestaurant,
  updateRestaurant, 
  deleteRestaurant,
  createFood, 
  updateFood,
  deleteFood 
} = require('../controllers/restaurantController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Define routes
router.route('/restaurants')
  .get(getRestaurants)
  .post(protect, adminOnly, createRestaurant);

router.route('/restaurants/:id')
  .put(protect, adminOnly, updateRestaurant)
  .delete(protect, adminOnly, deleteRestaurant);

router.route('/foods')
  .get(getFoods)
  .post(protect, adminOnly, createFood);

router.route('/foods/:id')
  .put(protect, adminOnly, updateFood)
  .delete(protect, adminOnly, deleteFood);

// Explicit export
module.exports = router;