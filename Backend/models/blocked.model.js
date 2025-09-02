import mongoose from "mongoose";
import { roomTypes, modelTypes, fileExtentions } from "./types.js";

const blockedSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      // enum: ["Blocked_Group_By_User", "Blocked_User_By_User", "Blocked_User_By_Group"],
      enum: [roomTypes.user, roomTypes.group],
      required: true,
      trim: true,
    },
    blockerUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelTypes.user,
    },
    blockerGroup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelTypes.group,
    },
    blockedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelTypes.user,
    },
    blockedGroup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelTypes.group,
    },
    reason: {
      type: String,
      enum: ["Spam", "Abuse", "Personal", "Others"],
      required: true,
      trim: true,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: [500, "message cannot exceed 500 characters"],
    },
  },
  { timestamps: true }
);

const Blocked = mongoose.model(modelTypes.blocked, blockedSchema);

export default Blocked;
