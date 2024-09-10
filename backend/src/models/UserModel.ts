import mongoose, { Document, Schema, Model, Mongoose } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

interface IUser extends Document {
  _id: mongoose.Types.ObjectId,
  username: string;
  email: string;
  password: string;
  profile_picture?: string;
  refreshToken?: string;
  isPasswordCorrect(password: string): Promise<boolean>;
  generateJwtToken(): string;
  generateRefreshToken(): string;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
    },
    profile_picture: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.isPasswordCorrect = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.generateJwtToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

UserSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);
export { User, IUser };
