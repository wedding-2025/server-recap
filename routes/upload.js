const express = require('express');
const router = express.Router();
const MediaItem = require('../models/MediaItem');

// ...existing code...

router.post('/upload-url', async (req, res) => {
  const { imgUrl, category } = req.body;

  try {
    const mediaItem = new MediaItem({ imgUrl, category });
    await mediaItem.save();
    res.status(200).json({ message: 'URL saved successfully' });
  } catch (error) {
    console.error('Error saving the URL', error);
    res.status(500).json({ message: 'Failed to save URL', error: error.message });
  }
});

// ...existing code...
module.exports = router;
