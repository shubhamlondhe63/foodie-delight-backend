const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Restaurant = require('../models/restaurant');
const Menu = require('../models/munu'); // Corrected typo

// Error Handling Function (Optional):
// This function can be used for centralized error handling.
function handleError(err, res) {
  console.error(err); // Log the error for debugging
  res.status(500).json({ message: 'Server error' });
}

// Get all restaurants
router.get('/', async (req, res) => {
  try {
    const restaurants = await Restaurant.find().populate('menus'); // Populate menus
    res.json(restaurants);
  } catch (err) {
    handleError(err, res); // Use the error handling function
  }
});

// Get one restaurant
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate('menus'); // Populate menus
    if (!restaurant) {
      return res.status(404).json({ message: 'Cannot find restaurant' });
    }
    res.json(restaurant);
  } catch (err) {
    handleError(err, res); // Use the error handling function
  }
});

router.post('/', async (req, res) => {
  const { name, description, location, openingHours, contactNumber, category, menus } = req.body;

  // Validate Required Fields:
  const requiredFields = ['name', 'description', 'location'];
  const missingFields = requiredFields.filter(field => !req.body[field]);
  if (missingFields.length > 0) {
    return res.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` });
  }

  try {
    const menuPromises = menus.map(async menu => {
      const newMenu = new Menu(menu); // Create Menu object
      await newMenu.save(); // Save menu first
      return newMenu._id; // Reference its _id in menus array
    });

    const restaurantMenus = await Promise.all(menuPromises); // Wait for all menus to save

    const restaurant = new Restaurant({
      name,
      description,
      location,
      openingHours, // Add optional fields
      contactNumber,
      category,
      menus: restaurantMenus // Array of Menu _ids
    });

    const newRestaurant = await restaurant.save();
    res.status(201).json(newRestaurant);
  } catch (err) {
    handleError(err, res); // Use the error handling function
  }
});

// Update a restaurant
router.put('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Cannot find restaurant' });
    }

    // Update fields only if provided in the request body
    restaurant.name = req.body.name || restaurant.name;
    restaurant.description = req.body.description || restaurant.description;
    restaurant.location = req.body.location || restaurant.location;
    restaurant.openingHours = req.body.openingHours || restaurant.openingHours; // Update optional fields
    restaurant.contactNumber = req.body.contactNumber || restaurant.contactNumber;
    restaurant.category = req.body.category || restaurant.category;
    if (req.body.menus) {
      const menuIds = await Promise.all(
        req.body.menus.map(async menu => {
          if (mongoose.Types.ObjectId.isValid(menu)) {
            return menu;
          } else {
            const newMenu = new Menu(menu);
            await newMenu.save();
            return newMenu._id;
          }
        })
      );
      restaurant.menus = menuIds;
    }

    const updatedRestaurant = await restaurant.save();
    res.json(updatedRestaurant);
  } catch (err) {
    handleError(err, res); // Use the error handling function
  }
});

// Delete a restaurant
router.delete('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Cannot find restaurant' });
    }
    res.json({ message: 'Deleted Restaurant' });
  } catch (err) {
    handleError(err, res); // Use the error handling function
  }
});

module.exports = router;
