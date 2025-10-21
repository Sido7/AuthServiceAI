import express from "express";
import {authControllerInstance} from '../controller/auth.controller'

const route  = express.Router();

route.post('/login', authControllerInstance.signIn);
route.post('/signup', authControllerInstance.signUp);
route.post('/logout', authControllerInstance.logout);
export default route
