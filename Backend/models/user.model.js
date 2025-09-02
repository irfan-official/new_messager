import mongoose from "mongoose";
import { roomTypes, modelTypes, fileExtentions } from "./types.js";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
    },
    name: {
      type: "String",
      trim: true,
      required: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [50, "message cannot exceed 50 characters"],
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    socketID: {
      type: String,
      trim: true,
    },
    active: {
      type: Boolean,
      enum: [true, false],
      default: false,
    },
    lastActiveTime: {
      type: Date,
      trim: true,
      default: Date.now,
    },
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelTypes.image,
      required: true,
    },

    views: [
      {
        index: {
          type: Number,
          default: 1,
        },
        room: {
          type: mongoose.Schema.Types.ObjectId,
          ref: modelTypes.room, // "Room"
        },
      },
    ],

    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: modelTypes.user,
      },
    ],
    blocked: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: modelTypes.blocked,
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model(modelTypes.user, userSchema);

export default User;
