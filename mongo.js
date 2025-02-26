import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

// MongoDB URL
const uri = process.env.MONGO_URL;
const client = new MongoClient(uri);

// Database and collection details
const dbName = 'Image_Upload';
const collectionName = 'videos';

async function deleteAllDocuments() {
  try {
    // Connect to the MongoDB client
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Delete all documents
    const deleteResults = await collection.deleteMany({});
    console.log(`${deleteResults.deletedCount} document(s) deleted.`)
  } catch (error) {
    console.error('Error deleting documents:', error)
  } finally {
    // Close the connection
    await client.close();
    console.log('MongoDB connection closed');
  }
}

async function listAllDocuments() {
  try {
    // Connect to the MongoDB client
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // List all documents
    const documents = await collection.find({}).toArray();
    console.log('Documents in collection:', documents);
    console.log(documents.length)
  } catch (error) {
    console.error('Error listing documents:', error);
  } finally {
    // Close the connection
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Call the function to list all documents
// listAllDocuments();
// deleteAllDocuments();