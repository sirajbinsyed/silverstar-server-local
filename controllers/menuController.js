const MenuItem = require('../models/MenuItem');
const cloudinary = require('../config/cloudinary');

// @desc    Get all menu items
// @route   GET /api/menu
// @access  Public
const getMenuItems = async (req, res) => {
  try {
    const { category, search, isAvailable, page = 1, limit = 50 } = req.query;

    // Build query
    let query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (isAvailable !== undefined) {
      query.isAvailable = isAvailable === 'true';
    }

    // Execute query with pagination
    const menuItems = await MenuItem.find(query)
      .populate('category', 'name slug')
      .sort({ sortOrder: 1, name: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await MenuItem.countDocuments(query);

    res.json({
      success: true,
      count: menuItems.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: menuItems
    });
  } catch (error) {
    console.error('Get menu items error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get menu items by category
// @route   GET /api/menu/category/:categoryId
// @access  Public
const getMenuItemsByCategory = async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ 
      category: req.params.categoryId,
      isAvailable: true 
    })
      .populate('category', 'name slug')
      .sort({ sortOrder: 1, name: 1 });

    res.json({
      success: true,
      count: menuItems.length,
      data: menuItems
    });
  } catch (error) {
    console.error('Get menu items by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single menu item
// @route   GET /api/menu/:id
// @access  Public
const getMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id)
      .populate('category', 'name slug');

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    res.json({
      success: true,
      data: menuItem
    });
  } catch (error) {
    console.error('Get menu item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create menu item
// @route   POST /api/menu
// @access  Private
const createMenuItem = async (req, res) => {
  try {
    let imageData = {};

    // Handle image upload if present
    if (req.file) {
      try {
        // Upload to Cloudinary
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            {
              folder: 'silver-star-menu',
              transformation: [
                { width: 800, height: 600, crop: 'fill' },
                { quality: 'auto' }
              ]
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          ).end(req.file.buffer);
        });

        imageData = {
          url: result.secure_url,
          publicId: result.public_id
        };
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        return res.status(400).json({
          success: false,
          message: 'Image upload failed'
        });
      }
    }

    // Parse sizes if it's a string
    let sizes = {};
    if (req.body.sizes) {
      try {
        sizes = typeof req.body.sizes === 'string' 
          ? JSON.parse(req.body.sizes) 
          : req.body.sizes;
      } catch (error) {
        console.error('Sizes parsing error:', error);
      }
    }

    // Create menu item data
    const menuItemData = {
      ...req.body,
      sizes,
      image: imageData,
      // Convert string booleans to actual booleans
      isAvailable: req.body.isAvailable === 'true',
      isVegetarian: req.body.isVegetarian === 'true',
      isSpicy: req.body.isSpicy === 'true'
    };

    const menuItem = await MenuItem.create(menuItemData);
    
    // Populate category before sending response
    await menuItem.populate('category', 'name slug');

    res.status(201).json({
      success: true,
      message: 'Menu item created successfully',
      data: menuItem
    });
  } catch (error) {
    console.error('Create menu item error:', error);
    
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors).map(val => val.message).join(', ');
      return res.status(400).json({
        success: false,
        message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update menu item
// @route   PUT /api/menu/:id
// @access  Private
const updateMenuItem = async (req, res) => {
  try {
    let menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    let imageData = menuItem.image;

    // Handle new image upload
    if (req.file) {
      try {
        // Delete old image from Cloudinary if exists
        if (menuItem.image.publicId) {
          await cloudinary.uploader.destroy(menuItem.image.publicId);
        }

        // Upload new image
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            {
              folder: 'silver-star-menu',
              transformation: [
                { width: 800, height: 600, crop: 'fill' },
                { quality: 'auto' }
              ]
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          ).end(req.file.buffer);
        });

        imageData = {
          url: result.secure_url,
          publicId: result.public_id
        };
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        return res.status(400).json({
          success: false,
          message: 'Image upload failed'
        });
      }
    }

    // Parse sizes if it's a string
    let sizes = menuItem.sizes;
    if (req.body.sizes) {
      try {
        sizes = typeof req.body.sizes === 'string' 
          ? JSON.parse(req.body.sizes) 
          : req.body.sizes;
      } catch (error) {
        console.error('Sizes parsing error:', error);
      }
    }

    // Update menu item data
    const updateData = {
      ...req.body,
      sizes,
      image: imageData,
      // Convert string booleans to actual booleans
      isAvailable: req.body.isAvailable === 'true',
      isVegetarian: req.body.isVegetarian === 'true',
      isSpicy: req.body.isSpicy === 'true'
    };

    menuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    ).populate('category', 'name slug');

    res.json({
      success: true,
      message: 'Menu item updated successfully',
      data: menuItem
    });
  } catch (error) {
    console.error('Update menu item error:', error);
    
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors).map(val => val.message).join(', ');
      return res.status(400).json({
        success: false,
        message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete menu item
// @route   DELETE /api/menu/:id
// @access  Private
const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    // Delete image from Cloudinary if exists
    if (menuItem.image.publicId) {
      try {
        await cloudinary.uploader.destroy(menuItem.image.publicId);
      } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
      }
    }

    await MenuItem.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Menu item deleted successfully'
    });
  } catch (error) {
    console.error('Delete menu item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getMenuItems,
  getMenuItemsByCategory,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
};