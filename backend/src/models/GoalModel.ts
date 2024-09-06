import mongoose, { Document, Schema } from "mongoose";

const GoalModel = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    targetAmount: { type: Number, required: true },
    currentAmount: { type: Number, required: true },
    deadline: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Goal", GoalModel);
