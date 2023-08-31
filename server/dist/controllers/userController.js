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
exports.getUserFriends = exports.searchFriends = exports.removeFriend = exports.addFriend = exports.addExcelSheet = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const fs_1 = __importDefault(require("fs"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const userModel_1 = __importDefault(require("../models/userModel"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userExists = yield userModel_1.default.findOne({ email: req.body.email });
        if (userExists) {
            return res.status(400).json({ error: true, message: "Email id already taken" });
        }
        const hashedPassword = yield bcrypt_1.default.hash(req.body.password, 10);
        req.body.password = hashedPassword;
        const user = yield userModel_1.default.create(req.body);
        if (user) {
            return res.status(201).json({ error: false, message: 'User has been created Successfully', data: user });
        }
        else {
            return res.status(500).json({ error: true, message: "Ops!, Something went wrong" });
        }
    }
    catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield userModel_1.default.findOne({ email: req.body.email }).select('email password username friends');
        if (!user || user.isActive === false) {
            return res.status(400).json({ error: true, message: "Email not found" });
        }
        const isUser = yield bcrypt_1.default.compare(req.body.password, user.password);
        if (!isUser) {
            return res.status(400).json({ error: true, message: "Wrong password" });
        }
        //generate token
        let token = (0, authMiddleware_1.generateToken)(user._id);
        return res.status(200).json({ error: false, message: "Login successful", data: { user }, token: token });
    }
    catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
});
exports.login = login;
const addExcelSheet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    let emails = [];
    try {
        if (String((_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.path)) {
            fs_1.default.createReadStream(String((_b = req === null || req === void 0 ? void 0 : req.file) === null || _b === void 0 ? void 0 : _b.path))
                .pipe((0, csv_parser_1.default)({}))
                .on('data', (data) => emails.push(data))
                .on('end', () => __awaiter(void 0, void 0, void 0, function* () {
                yield findEmailsInDb(emails, req, res);
            }));
        }
        else {
            return res.status(500).json({ error: true, message: "Something went wrong in findEMailsInDb" });
        }
    }
    catch (error) {
        return res.status(500).json({ error: true, message: "Something went wrong in findEMailsInDb" });
    }
});
exports.addExcelSheet = addExcelSheet;
const findEmailsInDb = (emails, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        let providedMails = emails.map(x => x.Emails);
        const currentUser = yield userModel_1.default.findById(req.body.userId).populate('friends', 'email').lean();
        if (!req.body.userId) {
            console.log('userId missing');
        }
        providedMails = providedMails.filter((x) => x !== (currentUser === null || currentUser === void 0 ? void 0 : currentUser.email));
        let listOfUsers = yield userModel_1.default.find({ email: { $in: providedMails } }).lean();
        yield fs_1.default.unlink(String((_c = req === null || req === void 0 ? void 0 : req.file) === null || _c === void 0 ? void 0 : _c.path), (err) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log('success');
            }
        });
        return res.status(200).json({ error: false, data: listOfUsers });
    }
    catch (error) {
        return res.status(500).json({ error: true, message: "Something went wrong in findEMailsInDb" });
    }
});
const addFriend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const friendId = req.body._id;
        //update loggedInuserId friends list
        const isFriends = yield userModel_1.default.findOne({ _id: req.body.loggedInUserId, friends: { $in: friendId } }).lean();
        if (isFriends) {
            return res.status(400).json({ error: true, message: "you are already friends with this person" });
        }
        const user = yield userModel_1.default.findByIdAndUpdate(req.body.loggedInUserId, { $push: { friends: friendId } }, { new: true }).lean();
        if (!user) {
            return res.status(500).json({ error: true, message: "Something went wrong in adding friend" });
        }
        return res.status(200).json({ error: true, message: 'added friend successfully', user });
    }
    catch (error) {
        return res.status(500).json({ error: true, message: "Something went wrong in adding friend" });
    }
});
exports.addFriend = addFriend;
const removeFriend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const friendId = req.body.userId;
        //update loggedInuserId friends list
        //remove friends both ways
        const isFriends = yield userModel_1.default.findOne({ _id: req.body.loggedInUserId, friends: { $in: friendId } }).lean();
        if (!isFriends) {
            return res.status(400).json({ error: true, message: "He is not your friend to remove" });
        }
        const user = yield userModel_1.default.findByIdAndUpdate(req.body.loggedInUserId, { $pull: { friends: friendId } }, { new: true }).lean();
        if (!user) {
            return res.status(500).json({ error: true, message: "Something went wrong in adding friend" });
        }
        return res.status(200).json({ error: true, message: 'removed friend successfully', user });
    }
    catch (error) {
        return res.status(500).json({ error: true, message: "Something went wrong in adding friend" });
    }
});
exports.removeFriend = removeFriend;
const searchFriends = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.fsearch;
        if (!email) {
            return res.status(500).json({ error: true, user: [] });
        }
        let users = yield userModel_1.default.find({ email: { $regex: new RegExp(email, "i") } }).lean();
        users = users.filter(user => String(user._id) !== String(req.body.loggedInUserId));
        if (users) {
            return res.status(200).json({ error: false, user: users });
        }
        else {
            return res.status(500).json({ error: true, user: [] });
        }
    }
    catch (error) {
        return res.status(500).json({ error: true, message: "Something went getUserFriends" });
    }
});
exports.searchFriends = searchFriends;
const getUserFriends = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loggedInUserId = req.body.loggedInUserId;
        const user = yield userModel_1.default.findOne({ _id: loggedInUserId }).populate('friends').select('friends').lean();
        if (user) {
            return res.status(200).json({ error: false, message: 'removed friend successfully', user });
        }
        else {
            return res.status(500).json({ error: true, message: "Something went getUserFriends" });
        }
    }
    catch (error) {
        return res.status(500).json({ error: true, message: "Something went getUserFriends" });
    }
});
exports.getUserFriends = getUserFriends;
