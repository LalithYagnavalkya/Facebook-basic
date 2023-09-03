import { Router, Request, Response, NextFunction } from "express";
import multer from 'multer'

import { login, register, addExcelSheet, addFriend, removeFriend, getUserFriends, searchFriends } from '../controllers/userController'
import validateResource from "../middlewares/validateResource";
import { authenticateUser } from '../middlewares/authMiddleware'
import { createUserSchema, userLoginSchema } from "../schemas/userSchema";

const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log('inside storage')
        console.log(req.body)
        return cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        return cb(null, `${Date.now()}-${file.originalname}`)

    }
})

const upload = multer({ storage: storage })

router.post('/register', validateResource(createUserSchema), register)

router.post('/login', validateResource(userLoginSchema), login)

router.post('/uploadExcelSheet', authenticateUser, upload.single('csvdata'), addExcelSheet)

router.post('/addFriend', authenticateUser, addFriend)

router.post('/removeFriend', authenticateUser, removeFriend)

router.post('/searchFriends', authenticateUser, searchFriends)

router.get('/getUserFriends', authenticateUser, getUserFriends)

// router.get("/google", (req: Request, res: Response, next: NextFunction) => {
//     passport.authenticate("google", {
//         accessType: "offline",
//         prompt: "consent",
//         scope: ["profile", "email"],
//     })(req, res, next);
// });

// router.get(
//     "/google/callback",
//     passport.authenticate("google", {
//         successRedirect: process.env.GOOGLE_CALLBACK_URL,
//         failureRedirect: "/login/failed",
//     }),
// );

// router.get("/logout", (req: Request, res: Response) => {
//     if (req.user) {
//         req.logout({}, (err) => {
//             if (err) return res.status(500).json({ message: "Something went wrong." });
//             res.redirect("http://localhost:3000/home");
//         });
//         res.send("done");
//     }
// });

//passportGoogle
// import {
//     Strategy as GoogleStrategy,
//     Profile,
//     StrategyOptionsWithRequest,
//     VerifyCallback,
// } from "passport-google-oauth20";
// import { Request } from "express";
// import passport from "passport";
// import dotenv from "dotenv";
// import User, { IUser } from "../models/userModel";
// import logger from "../utils/logger";
// dotenv.config({ path: "./src/config/config.env" });

// const strategyOptions: StrategyOptionsWithRequest = {
//     clientID: process.env.GOOGLE_CLIENT_ID!,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     callbackURL: process.env.GOOGLE_CALLBACK_URL!,
//     scope: "https://www.googleapis.com/auth/drive",
//     passReqToCallback: true,
// };

// const passportSetup = () => {
//     passport.use(
//         new GoogleStrategy(
//             strategyOptions,
//             async (
//                 req: Request,
//                 accessToken: string,
//                 refreshToken: string,
//                 profile: Profile,
//                 cb: VerifyCallback,
//             ) => {
//                 logger.info(refreshToken, accessToken, profile);

//                 try {
//                     const user = await User.findOne({ email: profile._json.email });
//                     if (user) {
//                         // Update refresh token and profile pic link
//                         if (refreshToken) {
//                             user.refreshToken = refreshToken;
//                         }
//                         // Update profile pic
//                         const profilePic = profile._json.picture!.replace("s96", "s400");
//                         user.profilePic = profilePic;
//                         await user.save();
//                     } else {
//                         // Create a new user
//                         if (profile && profile._json) {
//                             const profilePic = profile._json.picture!.replace("s96", "s400");
//                             const userObj: IUser = {
//                                 username: profile._json.name!,
//                                 email: profile._json.email!,
//                                 refreshToken: refreshToken,
//                                 profilePic: profilePic,
//                             };
//                             await User.create(userObj);
//                         }
//                     }

//                     if (user) {
//                         return cb(null, { testing: true });
//                     }
//                 } catch (err) {
//                     logger.error("Error signing up", err);
//                     cb(err as Error, undefined);
//                 }
//             },
//         ),
//     );
// };

// export default passportSetup;

export default router;
