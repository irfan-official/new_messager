import mongoose from "mongoose";
import { modelTypes, groupTypes } from "../utils/types.js";

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: "String",
      trim: true,
      required: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [50, "message cannot exceed 50 characters"],
    },

    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelTypes.image,
      required: true,
    },

    password: {
      type: String,
      trim: true,
      minlength: 6,
      maxlength: 60,
    },

    card: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelTypes.card,
    },

    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelTypes.user,
      required: true,
    },

    groupOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelTypes.user,
    },

    admins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: modelTypes.user,
        required: true,
      },
    ],

    active: {
      type: Boolean,
      enum: [true, false],
      default: false,
    },
    type: {
      type: String,
      enum: [
        groupTypes.public,
        groupTypes.private,
        groupTypes.protectedPublic,
        groupTypes.protectedPrivate,
      ],
      required: true,
      trim: true,
    },

    limitOfMembers: {
      type: Number,
      default: 100,
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: modelTypes.user,
        required: true,
      },
    ],

    blocked: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: modelTypes.user,
      },
    ],
  },
  { timestamps: true }
);

groupSchema.pre("save", async function name(next) {
  this.groupOwner = this.creator;
});

const Group = mongoose.model(modelTypes.group, groupSchema);

export default Group;
