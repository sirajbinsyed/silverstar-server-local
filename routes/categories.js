const express = require('express');
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/categories
router.get('/', getCategories);

// @route   GET /api/categories/:id
router.get('/:id', getCategory);

// @route   POST /api/categories
router.post('/', auth, createCategory);

// @route   PUT /api/categories/:id
router.put('/:id', auth, updateCategory);

// @route   DELETE /api/categories/:id
router.delete('/:id', auth, deleteCategory);

module.exports = router;