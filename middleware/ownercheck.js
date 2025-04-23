const Blog = require('../models/blog');

module.exports = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ msg: 'Blog not found' });
    }

    // Check if user is admin or the original author
    if (req.user.role !== 'admin' && blog.author.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized to perform this action' });
    }

    next();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};