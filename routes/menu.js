const express = require('express');
const {
  getMenuItems,
  getMenuItemsByCategory,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
} = require('../controllers/menuController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// @route   GET /api/menu
router.get('/', getMenuItems);

// @route   GET /api/menu/category/:categoryId
router.get('/category/:categoryId', getMenuItemsByCategory);

// @route   GET /api/menu/:id
router.get('/:id', getMenuItem);

// @route   POST /api/menu
router.post('/', auth, upload.single('image'), createMenuItem);

// @route   PUT /api/menu/:id
router.put('/:id', auth, upload.single('image'), updateMenuItem);

// @route   DELETE /api/menu/:id
router.delete('/:id', auth, deleteMenuItem);

module.exports = router;