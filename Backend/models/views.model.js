import mongoose from "mongoose";
import { roomTypes, modelTypes, fileExtentions } from "../utils/types";

const viewsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelTypes.user,
      required: true,
    },
    index: {
      type: Number,
      default: 1,
    },
    card: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelTypes.card,
      required: true,
    },
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelTypes.channel,
      required: true,
    },
    lastCheckInTime: {
      type: Date,
      default: Date.now,
      trim: true,
    },
    lastCheckOutTime: {
      type: Date,
      default: Date.now,
      trim: true,
    },
    focus: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Views = mongoose.model(modelTypes.views, viewsSchema);

export default Views;
