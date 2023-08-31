"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
    password: { type: String, select: false },
    friends: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'user' }]
}, { timestamps: true });
const User = mongoose_1.default.model("user", userSchema);
exports.default = User;
