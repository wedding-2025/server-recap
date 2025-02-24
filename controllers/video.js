import Video from '../models/Video.js';

export const createVideo = async (req, res, next) => {
  const { imgUrl, category } = req.body; // remove category if there's an error

  if (!imgUrl) {
    res.status(400); 
    return next(new Error('ImgUrl or VideoUrl fields are required'));
  } // allows the upload to finish if at least video or images is present

  console.log("Received data: ", req.body);
  
  try {
    const upload_url = new Video({
      imgUrl,
      category, // remove category if there's an error
      // videoUrl,
    });

    await upload_url.save();

    res.status(201).json({
      success: true,
      upload_url,
    });
  } catch (error) {
    console.error('Error saving the URL', error);
    res.status(500);
    next(error);
  }
};