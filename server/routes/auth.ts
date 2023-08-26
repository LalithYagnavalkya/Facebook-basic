import { Router, Request, Response, NextFunction } from "express";
import {register} from '../controllers/authController'
const router = Router();

router.get('/register', register)

export default router;
