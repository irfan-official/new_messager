import mongoose from "mongoose";
import { cardTypes, modelTypes } from "../utils/types.js";

const cardSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [cardTypes.user, cardTypes.group],
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
  },
  { timestamps: true }
);

cardSchema.pre("save", async function name(next) {
  try {
    if (this.type === cardTypes.user) {
      if (!this.createdByUser) {
        return next(
          new Error("User ID is required for User type in card model")
        );
      }
    }

    if (this.type === cardTypes.group) {
      if (!this.createdByGroup) {
        return next(
          new Error("Group ID is required for Group type in card model")
        );
      }
    }
  } catch (error) {
    next(error);
  }
});

const Card = mongoose.model(modelTypes.card, cardSchema);

export default Card;
