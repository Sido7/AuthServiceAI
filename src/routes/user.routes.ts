import express from "express";
import {authControllerInstance} from '../controller/auth.controller'
import { authMiddleware } from "../middleware/auth.middleware";

const route  = express.Router();

route.post('/login', authControllerInstance.signIn);
route.post('/signup',  authMiddleware, authControllerInstance.signUp);
route.post('/logout',  authMiddleware, authControllerInstance.logout);
export default route
