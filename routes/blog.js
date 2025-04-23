const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const ownerCheck = require('../middleware/ownercheck');
const blogController = require('../controllers/blogcontroller');

// @route   GET api/blogs
// @desc    Get all blogs
// @access  Public
router.get('/', blogController.getAllBlogs);

// @route   GET api/blogs/:id
// @desc    Get blog by ID
// @access  Public
router.get('/:id', blogController.getBlogById);

// @route   POST api/blogs
// @desc    Create a blog
// @access  Private (Author)
router.post(
  '/',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('content', 'Content is required').not().isEmpty(),
      check('category', 'Category is required').not().isEmpty()
    ]
  ],
  blogController.createBlog
);

// @route   PUT api/blogs/:id
// @desc    Update blog
// @access  Private (Author or Admin)
router.put(
  '/:id',
  [
    auth,
    ownerCheck,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('content', 'Content is required').not().isEmpty(),
      check('category', 'Category is required').not().isEmpty()
    ]
  ],
  blogController.updateBlog
);

// @route   DELETE api/blogs/:id
// @desc    Delete blog
// @access  Private (Author or Admin)
router.delete('/:id', [auth, ownerCheck], blogController.deleteBlog);

// @route   GET api/blogs/category/:categoryId
// @desc    Get blogs by category
// @access  Public
router.get('/category/:categoryId', blogController.getBlogsByCategory);

module.exports = router;