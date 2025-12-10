
// const express = require('express');
// const router = express.Router();
// const { 
//   getRestaurants, 
//   getFoods, 
//   createRestaurant,
//   updateRestaurant, 
//   deleteRestaurant,
//   createFood, 
//   updateFood,
//   deleteFood 
// } = require('../controllers/restaurantController');
// const { protect, adminOnly } = require('../middleware/authMiddleware');

// // Define routes
// router.route('/restaurants')
//   .get(getRestaurants)
//   .post(protect, adminOnly, createRestaurant);

// router.route('/restaurants/:id')
//   .put(protect, adminOnly, updateRestaurant)
//   .delete(protect, adminOnly, deleteRestaurant);

// router.route('/foods')
//   .get(getFoods)
//   .post(protect, adminOnly, createFood);

// router.route('/foods/:id')
//   .put(protect, adminOnly, updateFood)
//   .delete(protect, adminOnly, deleteFood);

// // Explicit export
// module.exports = router;



























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

// ==========================================================
// RESTAURANT ROUTES (Now accessible via /api/restaurants)
// ==========================================================

// GET /api/restaurants (Public)
// POST /api/restaurants (Admin Only: CREATE) <-- FIX APPLIED HERE: Uses '/' not '/restaurants'
router.route('/') 
  .get(getRestaurants) 
  .post(protect, adminOnly, createRestaurant); 

// PUT /api/restaurants/:id (Admin Only: UPDATE) <-- FIX APPLIED HERE: Uses '/:id' not '/restaurants/:id'
// DELETE /api/restaurants/:id (Admin Only: DELETE)
router.route('/:id') 
  .put(protect, adminOnly, updateRestaurant) 
  .delete(protect, adminOnly, deleteRestaurant); 


// ==========================================================
// FOOD ITEM ROUTES (Accessible via /api/restaurants/foods)
// These routes were already correctly configured.
// ==========================================================

// GET /api/restaurants/foods (Public)
// POST /api/restaurants/foods (Admin Only: CREATE)
router.route('/foods')
  .get(getFoods)
  .post(protect, adminOnly, createFood);

// PUT /api/restaurants/foods/:id (Admin Only: UPDATE)
// DELETE /api/restaurants/foods/:id (Admin Only: DELETE)
router.route('/foods/:id')
  .put(protect, adminOnly, updateFood)
  .delete(protect, adminOnly, deleteFood);

// Explicit export
module.exports = router;