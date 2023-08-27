import { Router, Request, Response, NextFunction } from "express";
import { login, register } from '../controllers/userController'
import validateResource from "../middlewares/validateResource";
import { createUserSchema, userLoginSchema } from "../schemas/userSchema";
const router = Router();

router.post('/register', validateResource(createUserSchema), register)

router.post('/login', validateResource(userLoginSchema), login)

export default router;
