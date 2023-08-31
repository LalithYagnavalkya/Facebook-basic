"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = require("dotenv");
const userModel_1 = __importDefault(require("../models/userModel"));
(0, dotenv_1.config)({
    path: "../config/config.env",
});
const generateToken = (userId) => {
    const secretKey = process.env.SECRET_KEY;
    const token = jsonwebtoken_1.default.sign({ userId }, secretKey, { expiresIn: '1h' });
    return token;
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    try {
        const secretKey = process.env.SECRET_KEY;
        let decoded = jsonwebtoken_1.default.verify(token, secretKey);
        return decoded;
    }
    catch (error) {
        return null;
    }
};
exports.verifyToken = verifyToken;
const authenticateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    if (token) {
        token = token.replace(/^Bearer\s+/, "");
    }
    const decoded = (0, exports.verifyToken)(token);
    if (!(decoded === null || decoded === void 0 ? void 0 : decoded.userId)) {
        return res.status(401).json({ error: 'Invalid token' });
    }
    try {
        const user = yield userModel_1.default.findById(decoded === null || decoded === void 0 ? void 0 : decoded.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        req.body.user = user;
        req.body.loggedInUserId = user._id;
        console.log(req.body);
        next();
    }
    catch (error) {
        res.status(500).json({ error: 'An error occurred while authenticating the user' });
    }
});
exports.authenticateUser = authenticateUser;
