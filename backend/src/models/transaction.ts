import mongoose, { Document, Schema, Model } from "mongoose";
interface ITransaction extends Document {
  user: Schema.Types.ObjectId;
  amount: number;
  type: "income" | "expense";
  category: Schema.Types.ObjectId;
  date: Date;
  description?: string;
  isRecurring: boolean;
  recurrenceInterval: "daily" | "weekly" | "monthly" | "yearly";
  recurrenceStartDate?: Date;
}
const TranscationSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ["income", "expense"], required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    date: { type: Date, required: true },
    description: { type: String },
    isRecurring: { type: Boolean, default: false },
    recurrenceInterval: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
      default: "monthly",
    },
    recurrenceStartDate: { type: Date },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model<ITransaction>("Transaction", TranscationSchema);
