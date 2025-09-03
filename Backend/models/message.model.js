import mongoose from "mongoose";
import { roomTypes, modelTypes, fileExtentions } from "../utils/types.js";

const messageSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [modelTypes.user, modelTypes.group],
      required: true,
      trim: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelTypes.room,
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelTypes.user,
      required: true,
    },
    message: {
      type: String,
      trim: true,
      default: "",
      maxlength: [500, "message cannot exceed 500 characters"],
    },
    media: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelTypes.media,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model(modelTypes.message, messageSchema);

export default Message;
