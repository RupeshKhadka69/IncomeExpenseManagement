import mongoose, {Document,Schema,Model} from "mongoose";

const CategoryModel = new Schema(
    {
    user: {type: Schema.Types.ObjectId, ref: "User", required: true},
    name: {type: String, required: true},
    type: {type: String,enum: ["income","expense"], required: true},

    },
    {
        timestamps: true,
    }
)

export default mongoose.model("Category",CategoryModel);