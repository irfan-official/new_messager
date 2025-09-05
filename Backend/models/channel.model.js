import mongoose from "mongoose";
import { cardTypes, modelTypes } from "../utils/types.js";

const communicationChannelSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      required: true,
      enum: [cardTypes.user, cardTypes.group],
      trim: true,
    },

    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelTypes.group,
    },

    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: modelTypes.user,
      },
    ],

    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelTypes.message,
    },
  },
  { timestamps: true }
);

communicationChannelSchema.pre("save", async function (next) {
  try {
    if (this.type === cardTypes.group) {
      // Group type: Ensure group exists
      if (!this.group) {
        return next(new Error("Group ID is required for group type"));
      }
      const Group = mongoose.model(modelTypes.group);
      const exists = await Group.findById(this.group);
      if (!exists) {
        return next(new Error("Group does not exist"));
      }
    }

    if (this.type === cardTypes.user) {
      // User type: Ensure users exist
      if (!this.users || this.users.length === 0) {
        return next(new Error("At least one user is required for user type"));
      }
      const User = mongoose.model(modelTypes.user);
      const count = await User.countDocuments({ _id: { $in: this.users } });

      if (count !== this.users.length) {
        return next(new Error("One or more users do not exist"));
      }
    }

    next();
  } catch (error) {
    next(err);
  }
});

const Channel = mongoose.model(modelTypes.channel, communicationChannelSchema);

export default Channel;
