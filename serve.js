import { MongoClient } from "mongodb";
import dotenv from 'dotenv';

dotenv.config();

// async function main() {
  
//   const uri = 'mongodb+srv://mjcharles2025:lf4MbtnCZklmF93D@uploads.dgy6e.mongodb.net/?retryWrites=true&w=majority&appName=uploads'; // &appName=upload
//   // mongodb+srv://mjcharles2025:lf4MbtnCZklmF93D@uploads.dgy6e.mongodb.net/?retryWrites=true&w=majority&appName=uploads

//   const client = new MongoClient(uri);

//   try {
//     await client.connect(); 

//     await listDatabases(client);

//   } catch (e) {
//     console.error(e)
//   } finally {
//     await client.close();
//   }

// }

// main().catch(console.error);

// async function listDatabases(client) {
//   const databasesList = await client.db().admin().listDatabases();

//   console.log('Databases:');
//   databasesList.databases.forEach(db => {
//     console.log(`- ${db.name}`);
//   });  
// }



async function main() {
  const uri = process.env.MONGO_URL;
  
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected successfully to MongoDB!");

    // List collections in the "Image_Upload" database
    await listCollections(client, "Image_Upload");

    // Fetch imgUrl and videoUrl for each document in the "videos" collection
    await fetchImgAndVideoUrls(client, "Image_Upload", "videos");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  } finally {
    await client.close();
  }
}

async function listCollections(client, dbName) {
  const database = client.db(dbName);
  const collections = await database.listCollections().toArray();

  console.log(`Collections in "${dbName}":`);
  collections.forEach((collection) => console.log(`- ${collection.name}`));
}

async function fetchImgAndVideoUrls(client, dbName, collectionName) {
  const database = client.db(dbName);
  const collection = database.collection(collectionName);

  // Fetch all documents in the collection
  // const documents = await collection.find({}).toArray();
  const documents = await collection.find({}, { projection: { _id: 1, imgUrl: 1 } }).toArray();

  console.log(`\nDocuments in "${collectionName}" collection:`);

  // Iterate through the documents and log required fields
  documents.forEach((doc) => {
    console.log({
      id: doc._id,
      imgUrl: doc.imgUrl,
    });
    console.log(`the length: ${documents.length}`)
  });
}

main().catch(console.error);























/*
import React, { useState } from 'react';
import axios from 'axios';
import { ThreeDots } from 'react-loader-spinner';

const Upload = () => {

  const [img, setImg] = useState(null);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadFile = async (type) => {
    const data = new FormData();
    const file = type === 'image' ? img : video;
    if (!file) {
      console.error(`No ${type} file selected`);
      return null;
    }
    data.append('file', file);
    data.append('upload_preset', type === 'image' ? 'mandc_default_img' : 'mandc_default_vid');
  
    try {
      let cloudName = 'dzsuia2ia'; // process.env.CLOUDINARY_CLOUD_NAME; console.log(cloudName);
      let resourceType = type === 'image' ? 'image' : 'video';
      let api = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
  
      const res = await axios.post(api, data);
      const { secure_url } = res.data;
      console.log(secure_url);
      console.log(`${type} uploaded to:`, secure_url);
      return secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error.response ? error.response.data : error);
    }
  };
  

  const handleTheSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Upload image file
      const imgUrl = await uploadFile('image');

      // Upload video file
      const videoUrl = await uploadFile('video');

      // Send backend api request
      const BACKEND_URL = 'http://localhost:4000/api/videos';
      await axios.post(`${BACKEND_URL}`, { imgUrl, videoUrl });

      // Reset status
      setImg(null);
      setVideo(null);

      console.log('File upload success');
      setLoading(false);
    } catch (error) {
      console.error(error.response ? error.response.data : error);
    }
  }

  return (
    <div className='mt-[100px] mb-[100px]'>
      <form onSubmit={handleTheSubmit}>
        <div>
          <label htmlFor="video">Video:</label>
          <br />
          <input
            type="file"
            accept='video/*'
            className='cursor-pointer'
            id='video'
            onChange={(e) => setVideo((prev) => e.target.files[0])}
        />
        </div>
        <br />
        <div>
          <label htmlFor="img">Image</label>
          <br />
          <input
            type="file"
            accept='image/*'
            className='cursor-pointer'
            id='img'
            onChange={(e) => setImg((prev) => e.target.files[0])}
          />
        </div>
        <br />
        <button type='submit'>Upload</button>
      </form>

      {
      loading && <ThreeDots
        height="80"
        width="80"
        radius="9"
        color='#4fa94d'
        ariaLabel='three-dots-loading'
        wrapperStyle={{}}
        wrapperClassName=""
        visible={true}
      />
    }
    </div>


  )
}

export default Upload
*/