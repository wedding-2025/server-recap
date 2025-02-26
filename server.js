import { fileURLToPath } from 'url';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import { connectDB } from './config/db.js';
import { errorHandler } from './middlewares/error.js';
import videoRoutes from './routes/video.js';
import signUploadRoutes from './routes/sign-upload.js';
import NodeCache from 'node-cache'; // Import node-cache
import fs from 'fs';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Route to update image.json with metadata
app.post('/api/update-image-json', async (req, res) => {
  const { imgUrl, category } = req.body;

  console.log('Received request to update image.json with:', { imgUrl, category });

  const imagePath = path.resolve(__dirname, '../src', 'image.json'); // Ensure correct path to image.json
  console.log('Resolved image.json path:', imagePath);

  let imageJson = { imageData: [] };

  // Ensure the directory exists
  const dir = path.dirname(imagePath);
  if (!fs.existsSync(dir)) {
    console.log('Directory does not exist. Creating directory...');
    fs.mkdirSync(dir, { recursive: true });
  }

  // Read existing data from image.json
  if (fs.existsSync(imagePath)) {
    console.log('image.json exists. Reading data...');
    const data = fs.readFileSync(imagePath, 'utf8');
    imageJson = JSON.parse(data);
  } else {
    console.log('image.json does not exist. Creating new file...');
  }

  // Add new metadata to imageData array
  imageJson.imageData.push({ imgUrl, category });

  // Write updated data back to image.json
  try {
    fs.writeFileSync(imagePath, JSON.stringify(imageJson, null, 2), 'utf8');
    console.log('Successfully updated image.json');
    res.status(200).json({ message: 'Image metadata updated successfully' });
  } catch (error) {
    console.error('Error writing to image.json:', error);
    res.status(500).json({ message: 'Failed to update image.json' });
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