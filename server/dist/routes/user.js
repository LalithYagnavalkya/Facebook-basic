"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const userController_1 = require("../controllers/userController");
const validateResource_1 = __importDefault(require("../middlewares/validateResource"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const userSchema_1 = require("../schemas/userSchema");
const router = (0, express_1.Router)();
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        console.log('inside storage');
        console.log(req.body);
        return cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        return cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = (0, multer_1.default)({ storage: storage });
router.post('/register', (0, validateResource_1.default)(userSchema_1.createUserSchema), userController_1.register);
router.post('/login', (0, validateResource_1.default)(userSchema_1.userLoginSchema), userController_1.login);
router.post('/uploadExcelSheet', authMiddleware_1.authenticateUser, upload.single('csvdata'), userController_1.addExcelSheet);
router.post('/addFriend', authMiddleware_1.authenticateUser, userController_1.addFriend);
router.post('/removeFriend', authMiddleware_1.authenticateUser, userController_1.removeFriend);
router.post('/searchFriends', authMiddleware_1.authenticateUser, userController_1.searchFriends);
router.get('/getUserFriends', authMiddleware_1.authenticateUser, userController_1.getUserFriends);
exports.default = router;
