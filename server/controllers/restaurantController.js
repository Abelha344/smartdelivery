// const Restaurant = require('../models/Restaurant');
// const FoodItem = require('../models/FoodItem');

// // @desc    Get all restaurants
// // @route   GET /api/restaurants
// // @access  Public
// const getRestaurants = async (req, res) => {
//   try {
//     const restaurants = await Restaurant.find({});
//     res.status(200).json(restaurants);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc    Get all foods
// // @route   GET /api/foods
// // @access  Public
// const getFoods = async (req, res) => {
//   try {
//     const foods = await FoodItem.find({});
//     res.status(200).json(foods);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc    Create Restaurant
// // @route   POST /api/restaurants
// // @access  Private/Admin
// const createRestaurant = async (req, res) => {
//   try {
//     const restaurant = await Restaurant.create(req.body);
//     res.status(201).json(restaurant);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // @desc    Update Restaurant
// // @route   PUT /api/restaurants/:id
// // @access  Private/Admin
// const updateRestaurant = async (req, res) => {
//   try {
//     const restaurant = await Restaurant.findById(req.params.id);
//     if (!restaurant) {
//       return res.status(404).json({ message: 'Restaurant not found' });
//     }

//     const updatedRestaurant = await Restaurant.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true } // Return the updated document
//     );
    
//     res.status(200).json(updatedRestaurant);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc    Delete Restaurant
// // @route   DELETE /api/restaurants/:id
// // @access  Private/Admin
// const deleteRestaurant = async (req, res) => {
//   try {
//     const restaurant = await Restaurant.findById(req.params.id);
//     if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    
//     await Restaurant.deleteOne({ _id: req.params.id });
//     // Optional: Delete associated foods
//     await FoodItem.deleteMany({ restaurantId: req.params.id });
    
//     res.status(200).json({ id: req.params.id });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc    Create Food Item
// // @route   POST /api/foods
// // @access  Private/Admin
// const createFood = async (req, res) => {
//   try {
//     const food = await FoodItem.create(req.body);
//     res.status(201).json(food);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // @desc    Update Food Item
// // @route   PUT /api/foods/:id
// // @access  Private/Admin
// const updateFood = async (req, res) => {
//   try {
//     const food = await FoodItem.findById(req.params.id);
//     if (!food) {
//       return res.status(404).json({ message: 'Food item not found' });
//     }

//     const updatedFood = await FoodItem.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
    
//     res.status(200).json(updatedFood);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc    Delete Food Item
// // @route   DELETE /api/foods/:id
// // @access  Private/Admin
// const deleteFood = async (req, res) => {
//   try {
//     const food = await FoodItem.findById(req.params.id);
//     if (!food) return res.status(404).json({ message: 'Food not found' });
    
//     await FoodItem.deleteOne({ _id: req.params.id });
//     res.status(200).json({ id: req.params.id });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = {
//   getRestaurants,
//   getFoods,
//   createRestaurant,
//   updateRestaurant,
//   deleteRestaurant,
//   createFood,
//   updateFood,
//   deleteFood
// };
























// controllers/restaurantController.js (Contains both Restaurant and Food Logic)

const Restaurant = require('../models/Restaurant');
const FoodItem = require('../models/FoodItem');

// @desc    Get all restaurants
// @route   GET /api/restaurants
// @access  Public
const getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({});
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all foods
// @route   GET /api/restaurants/foods (Used to be /api/foods)
// @access  Public
const getFoods = async (req, res) => {
  try {
    const foods = await FoodItem.find({});
    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create Restaurant
// @route   POST /api/restaurants
// @access  Private/Admin
const createRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.create(req.body);
    res.status(201).json(restaurant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update Restaurant
// @route   PUT /api/restaurants/:id
// @access  Private/Admin
const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Return the updated document
    );
    
    res.status(200).json(updatedRestaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete Restaurant
// @route   DELETE /api/restaurants/:id
// @access  Private/Admin
const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    
    await Restaurant.deleteOne({ _id: req.params.id });
    // Optional: Delete associated foods
    await FoodItem.deleteMany({ restaurantId: req.params.id });
    
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create Food Item
// @route   POST /api/restaurants/foods
// @access  Private/Admin
const createFood = async (req, res) => {
  try {
    const food = await FoodItem.create(req.body);
    res.status(201).json(food);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update Food Item
// @route   PUT /api/restaurants/foods/:id
// @access  Private/Admin
const updateFood = async (req, res) => {
  try {
    const food = await FoodItem.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    const updatedFood = await FoodItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    res.status(200).json(updatedFood);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete Food Item
// @route   DELETE /api/restaurants/foods/:id
// @access  Private/Admin
const deleteFood = async (req, res) => {
  try {
    const food = await FoodItem.findById(req.params.id);
    if (!food) return res.status(404).json({ message: 'Food not found' });
    
    await FoodItem.deleteOne({ _id: req.params.id });
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRestaurants,
  getFoods,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  createFood,
  updateFood,
  deleteFood
};