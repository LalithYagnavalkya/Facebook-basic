import { Request, Response } from "express";
import bcrypt from 'bcrypt'
import csv from 'csv-parser'
import fs from 'fs'

import { CreateUserInput, userLoginInput } from '../schemas/userSchema'
import { generateToken } from "../middlewares/authMiddleware";

import User from '../models/userModel'

export const register = async (req: Request<{}, {}, CreateUserInput['body']>, res: Response) => {
    try {
        let userExists = await User.findOne({ email: req.body.email })
        if (userExists) {
            return res.status(400).json({ error: true, message: "Email id already taken" })
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        req.body.password = hashedPassword;
        const user = await User.create(req.body)
        if (user) {
            return res.status(201).json({ error: false, message: 'User has been created Successfully', data: user })
        } else {
            return res.status(500).json({ error: true, message: "Ops!, Something went wrong" })
        }
    } catch (error: any) {
        return res.status(500).json({ error: true, message: error.message })
    }
}

export const login = async (req: Request<{}, {}, userLoginInput['body']>, res: Response) => {
    try {
        let user = await User.findOne({ email: req.body.email }).select('email password username friends')
        if (!user || user.isActive === false) {
            return res.status(400).json({ error: true, message: "Email not found" })
        }
        const isUser = await bcrypt.compare(req.body.password, user.password)
        if (!isUser) {
            return res.status(400).json({ error: true, message: "Wrong password" })
        }
        //generate token
        let token = generateToken(user._id)
        return res.status(200).json({ error: false, message: "Login successful", data: { user }, token: token })

    } catch (error: any) {
        return res.status(500).json({ error: true, message: error.message })
    }
}

export const addExcelSheet = async (req: any, res: Response) => {
    let emails: any = [];
    try {
        fs.createReadStream(String(req?.file?.path))
            .pipe(csv({}))
            .on('data', (data: any) => emails.push(data))
            .on('end', () => {
                findEmailsInDb(emails, req, res)
            })

    } catch (error: any) {
        return res.status(500).json({ error: true, message: "Something went wrong in findEMailsInDb" })
    }
}
interface emailObj {
    Emails: string;
}
const findEmailsInDb = async (emails: [emailObj], req: Request, res: Response) => {
    try {
        let providedMails: string[] = emails.map(x => x.Emails)
        const currentUser = await User.findById(req.body.userId).populate('friends', 'email').lean();
        if (!req.body.userId) {
            console.log('userId missing')
        }
        providedMails = providedMails.filter((x: string) => x !== currentUser?.email)
        let listOfUsers = await User.find({ email: { $in: providedMails } }).lean();
        return res.status(200).json({ error: false, data: listOfUsers })
    } catch (error) {
        return res.status(500).json({ error: true, message: "Something went wrong in findEMailsInDb" })
    }


}

export const addFriend = async (req: Request, res: Response) => {
    try {
        const friendId = req.body._id;
        //update loggedInuserId friends list
        const isFriends = await User.findOne({ _id: req.body.loggedInUserId, friends: { $in: friendId } }).lean();
        if (isFriends) {
            return res.status(400).json({ error: true, message: "you are already friends with this person" })
        }
        const user = await User.findByIdAndUpdate(req.body.loggedInUserId, { $push: { friends: friendId } }, { new: true }).lean()
        if (!user) {
            return res.status(500).json({ error: true, message: "Something went wrong in adding friend" })
        }
        return res.status(200).json({ error: true, message: 'added friend successfully', user })

    } catch (error: any) {
        return res.status(500).json({ error: true, message: "Something went wrong in adding friend" })
    }
}

export const removeFriend = async (req: Request, res: Response) => {
    try {
        const friendId = req.body.userId;
        //update loggedInuserId friends list
        //remove friends both ways
        const isFriends = await User.findOne({ _id: req.body.loggedInUserId, friends: { $in: friendId } }).lean();
        if (!isFriends) {
            return res.status(400).json({ error: true, message: "He is not your friend to remove" })
        }
        const user = await User.findByIdAndUpdate(req.body.loggedInUserId, { $pull: { friends: friendId } }, { new: true }).lean()
        if (!user) {
            return res.status(500).json({ error: true, message: "Something went wrong in adding friend" })
        }
        return res.status(200).json({ error: true, message: 'removed friend successfully', user })
    } catch (error: any) {
        return res.status(500).json({ error: true, message: "Something went wrong in adding friend" })
    }

}

export const searchFriends = async (req: Request, res: Response) => {
    try {
        const email = req.body.fsearch;
        if (!email) {
            return res.status(500).json({ error: true, user: [] })
        }
        let users = await User.find({ email: { $regex: new RegExp(email, "i") } }).lean();
        users = users.filter(user => String(user._id) !== String(req.body.loggedInUserId))
        if (users) {
            return res.status(200).json({ error: false, user: users })
        } else {
            return res.status(500).json({ error: true, user: [] })
        }
    } catch (error: any) {
        return res.status(500).json({ error: true, message: "Something went getUserFriends" })
    }

}
export const getUserFriends = async (req: Request, res: Response) => {
    try {
        const loggedInUserId = req.body.loggedInUserId;
        const user = await User.findOne({ _id: loggedInUserId }).populate('friends').select('friends').lean();
        if (user) {
            return res.status(200).json({ error: false, message: 'removed friend successfully', user })
        } else {
            return res.status(500).json({ error: true, message: "Something went getUserFriends" })
        }
    } catch (error: any) {
        return res.status(500).json({ error: true, message: "Something went getUserFriends" })
    }

}




