import { Request, Response } from "express";
import bcrypt from 'bcrypt'

import { CreateUserInput } from '../schemas/userSchema'
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

export const login = async (req: Request<{}, {}, CreateUserInput['body']>, res: Response) => {

}

export const addExcelSheet = async (req: Request<{}, {}, CreateUserInput['body']>, res: Response) => {
    //exelsheet should 
}

// export const  = async(9)



