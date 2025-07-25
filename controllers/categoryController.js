const Category = require('../models/Category');
const MenuItem = require('../models/MenuItem');
const cloudinary = require('../config/cloudinary');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .sort({ sortOrder: 1, name: 1 });

    res.json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
const getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Private
const createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    console.error('Create category error:', error);
    
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

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });
  } catch (error) {
    console.error('Update category error:', error);
    
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

// @desc    Delete category and its menu items
// @route   DELETE /api/categories/:id
// @access  Private
const deleteCategory = async (req, res) => {
  const categoryId = req.params.id;
  console.log(`Attempting to delete category with ID: ${categoryId}`);

  try {
    const category = await Category.findById(categoryId);

    if (!category) {
      console.log('Category not found.');
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Find all menu items in the category
    console.log(`Searching for menu items with category ID: ${categoryId}`);
    const menuItems = await MenuItem.find({ category: categoryId });
    console.log(`Found ${menuItems.length} menu item(s) to delete.`);


    // Delete images from Cloudinary and the menu items from the database
    if (menuItems.length > 0) {
      // Collect all public IDs of images to be deleted
      const imagePublicIds = menuItems
        .map(item => item.image && item.image.publicId)
        .filter(id => id); // Filter out any null or undefined IDs

      if (imagePublicIds.length > 0) {
        console.log(`Deleting ${imagePublicIds.length} image(s) from Cloudinary...`);
        // Use Cloudinary's API to delete resources in a batch for efficiency
        await cloudinary.api.delete_resources(imagePublicIds);
        console.log('Cloudinary images deleted.');
      }

      // Delete all menu items associated with the category from the database
      console.log('Deleting menu items from database...');
      await MenuItem.deleteMany({ category: categoryId });
      console.log('Menu items deleted from database.');
    }

    // After deleting associated items, delete the category itself
    console.log('Deleting category from database...');
    await Category.findByIdAndDelete(categoryId);
    console.log('Category deleted successfully.');

    res.json({
      success: true,
      message: 'Category and all associated menu items deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
};