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

const Card = mongoose.model(modelTypes.card, cardSchema);

export default Card;
