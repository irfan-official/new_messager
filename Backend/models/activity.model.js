import mongoose from "mongoose";
import { roomTypes, modelTypes, fileExtentions } from "../utils/types.js";

const activitySchema = new mongoose.Schema({}, { timestamps: true });

const Activity = mongoose.model(modelTypes.activity, activitySchema);

export default Activity;
