import mongoose from "mongoose";
import { modelTypes } from "../utils/types.js";

const communicationChannelSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      trim: true,
    },
    card: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelTypes.card,
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelTypes.message,
    },
  },
  { timestamps: true }
);

const Channel = mongoose.model(modelTypes.channel, communicationChannelSchema);

export default Channel;
