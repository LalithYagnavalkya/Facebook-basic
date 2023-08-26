import { Request, Response } from "express";
import { CreateUserInput } from '../schemas/userSchema'

export const register = (req: Request<{}, {}, CreateUserInput['body']>, res: Response) => {
    try {
        return res.status(200).json({ message: 'testing' })
    } catch (error) {
        return res.status(500).json({ error: true, message: error.message })
    }
}
