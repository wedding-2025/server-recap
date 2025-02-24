import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import { connectDB } from './config/db.js';
import { errorHandler } from './middlewares/error.js';
import videoRoutes from './routes/video.js';
import signUploadRoutes from './routes/sign-upload.js';
import NodeCache from 'node-cache'; // Import node-cache

dotenv.config();

// Express App
const app = express();
const port = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB URL
const uri = process.env.MONGO_URL;
const client = new MongoClient(uri);

// Initialize cache
const cache = new NodeCache({ stdTTL: 600 }); // Cache TTL of 10 minutes

// Route to get media items (image URLs) from MongoDb
app.get('/api/media-items', async (req, res) => {
  const { category } = req.query;
  const cacheKey = `media-items-${category || 'all'}`;

  // Check if data is in cache
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return res.json(cachedData);
  }

  try {
    await client.connect();
    const database = client.db('Image_Upload');
    const collection = database.collection('videos');

    // Define filter object
    let filter = {};
    if (category) {
      filter.category = category;
    }

    // Fetch filtered media items from MongoDB
    const documents = await collection.find(filter, { projection: { imgUrl: 1, category: 1 } }).toArray();

    // Store the fetched data in cache
    cache.set(cacheKey, documents);

    // Send the filtered imgUrls to the frontend
    res.json(documents);
  } catch (error) {
    console.error('Error fetching media items: ', error);
    res.status(500).json({ message: 'Error fetching media items' });
  } finally {
    await client.close();
  }
});

// Routes
app.use('/api/upload-url', videoRoutes);
app.use('/api/sign-upload', signUploadRoutes);
app.use(errorHandler);

// Listen to the request
app.listen(port, () => {
  // Connect to DB
  connectDB();
  console.log('server started listening on port', port, `the mongo-URL: ${process.env.MONGO_URL}`);
});