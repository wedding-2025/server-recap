import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    imgUrl: {
      type: String,
      // required: true,
    },
    videoUrl: {
      type: String,
    //   // required: true, // removed to allow either one of the media file to upload without the other
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Video", videoSchema);