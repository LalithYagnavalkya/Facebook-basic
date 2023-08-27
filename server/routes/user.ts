import { Router, Request, Response, NextFunction } from "express";
import multer from 'multer'

import { login, register, addExcelSheet } from '../controllers/userController'
import validateResource from "../middlewares/validateResource";
import { authenticateUser } from '../middlewares/authMiddleware'
import { createUserSchema, userLoginSchema } from "../schemas/userSchema";

const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        return cb(null, `${Date.now()}-${file.originalname}`)

    }
})

const upload = multer({ storage: storage })

router.post('/register', validateResource(createUserSchema), register)

router.post('/login', validateResource(userLoginSchema), login)

router.post('/uploadExcelSheet', upload.single('csvdata'), addExcelSheet)

export default router;
