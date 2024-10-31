import mongoose, { Document, Schema } from "mongoose";

const BudgetModel = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    BudgetName: {type: String, required: true},
    amount: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    period: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);


export default mongoose.model("budget",BudgetModel)