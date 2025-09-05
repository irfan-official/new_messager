import mongoose from "mongoose";
import { modelTypes } from "../utils/types.js";

const messageSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [modelTypes.user, modelTypes.group],
      required: true,
      trim: true,
    },
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelTypes.channel,
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
