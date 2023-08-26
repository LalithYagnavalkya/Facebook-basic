import mongoose, { Document, Model } from "mongoose";

interface IUser extends Document {
    username: string;
    email: string;
    isActive: boolean;
    password: string,
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true },
        email: { type: String, required: true },
        isActive: { type: Boolean, default: true },
        password: { type: String }
    },
    { timestamps: true }
);

const User: Model<IUser> = mongoose.model<IUser>("user", userSchema);

export default User;
