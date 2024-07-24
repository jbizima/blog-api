const express = require('express');
const router = express.Router();
const BlogPost = require('../models/BlogPost');

// Create blog post
router.post('/', async (req, res) => {
  try {
    const postData = req.body;
    const createdBlogPost = await BlogPost.create(postData);
    res.status(201).json(createdBlogPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating blog post' });
  }
});

// Get all blog posts
router.get('/', async (req, res) => {
  try {
    const blogPosts = await BlogPost.findAll();
    res.json(blogPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching blog posts' });
  }
});

// Get blog post by ID
router.get('/:id', async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);
    if (!blogPost) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    res.json(blogPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching blog post' });
  }
});

// Update blog post
router.put('/:id', async (req, res) => {
  try {
    const updatedBlogPost = await BlogPost.update(req.params.id, req.body);
    res.json(updatedBlogPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating blog post' });
  }
});

// Delete blog post
router.delete('/:id', async (req, res) => {
  try {
    await BlogPost.delete(req.params.id);
    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting blog post' });
  }
});

module.exports = router;