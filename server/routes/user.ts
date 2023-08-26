import { Router, Request, Response, NextFunction } from "express";
import { register } from '../controllers/userController'
import validateResource from "../middlewares/validateResource";
import { createUserSchema } from "../schemas/userSchema";
const router = Router();

router.post('/register', validateResource(createUserSchema), register)

export default router;
