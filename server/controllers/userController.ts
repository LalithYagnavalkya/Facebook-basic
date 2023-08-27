import { Request, Response } from "express";
import bcrypt from 'bcrypt'

import { CreateUserInput, userLoginInput } from '../schemas/userSchema'
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
        return res.status(200).json({ error: false, message: "Login successful", data: user })

    } catch (error: any) {
        return res.status(500).json({ error: true, message: error.message })
    }
}

export const addExcelSheet = async (req: Request<{}, {}, CreateUserInput['body']>, res: Response) => {
    //exelsheet should 
    //take all the user emails and search in db
    //before returning all the users for this particular loggedInUser check who are friends and if they are friends send
    // is friend true feild in each obj.
    //return all the users which are fetched
}

export const addFriend = (req: Request<{}, {}, CreateUserInput['body']>, res: Response) => { }

export const removeFriend = (req: Request<{}, {}, CreateUserInput['body']>, res: Response) => { }




