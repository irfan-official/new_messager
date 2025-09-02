import mongoose from "mongoose";
import { roomTypes, modelTypes, fileExtentions } from "./types.js";

/// if allUsers are active then group is active
const mediaSchema = new mongoose.Schema(
  {
    type: {
      enum: [modelTypes.image, modelTypes.video, modelTypes.audio],
      type: String,
      required: true,
    },
    message: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelTypes.message,
      required: true,
    },
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelTypes.image,
    },
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelTypes.video,
    },
    audio: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelTypes.audio,
    },
  },
  { timestamps: true }
);

const Media = mongoose.model(modelTypes.media, mediaSchema);

export default Media;

const imageSchema = new mongoose.Schema(
  {
    extentionType: {
      type: String,
      enum: [
        fileExtentions.image.jpg,
        fileExtentions.image.jpeg,
        fileExtentions.image.png,
      ],
      required: true,
    },
    url: {
      type: String,
      trim: true,
      required: true,
    },
    type: {
      type: String,
      enum: [modelTypes.user, modelTypes.group],
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelTypes.user,
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelTypes.group,
    },
  },
  { timestamps: true }
);

export const image = mongoose.model(modelTypes.image, imageSchema);

const videoSchema = new mongoose.Schema(
  {
    extentionType: {
      type: String,
      enum: [
        fileExtentions.video.mp4,
        fileExtentions.video.video,
        fileExtentions.video.mp4,
      ],
      required: true,
    },
    url: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { timestamps: true }
);

export const Video = mongoose.model(modelTypes.video, videoSchema);

const audioSchema = new mongoose.Schema(
  {
    extentionType: {
      type: String,
      enum: [fileExtentions.audio.mp3],
      required: true,
    },
    url: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { timestamps: true }
);

export const Audio = mongoose.model(modelTypes.audio, audioSchema);
