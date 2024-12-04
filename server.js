import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import { connectDB } from './config/db.js';
import { errorHandler } from './middlewares/error.js';
import videoRoutes from './routes/video.js';
import signUploadRoutes from './routes/sign-upload.js';

dotenv.config();

// Express App
const app = express();
const port = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB URL
const uri = process.env.MONGO_URL
const client = new MongoClient(uri);

// Route to get media items (image URLs) from MongoDb
app.get('/api/media-items', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('Image_Upload');
    const collection = database.collection('videos');

    // Fetch imgUrl from the database
    const documents = await collection.find({}, { projection: { imgUrl: 1 } }).toArray();

    // Send the imgUrls to the frontend
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