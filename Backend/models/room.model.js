import mongoose from "mongoose";
import { roomTypes, modelTypes } from "../utils/types.js";

const roomSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      trim: true,
    },

    type: {
      type: String,
      enum: [roomTypes.user, roomTypes.group, roomTypes.private],
      required: true,
      trim: true,
    },

    createdByUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelTypes.user,
    },

    createdByGroup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelTypes.group,
    },

    admins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: modelTypes.user,
        required: true,
      },
    ],

    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelTypes.message,
    },
  },
  { timestamps: true }
);

const Room = mongoose.model(modelTypes.room, roomSchema);

export default Room;
