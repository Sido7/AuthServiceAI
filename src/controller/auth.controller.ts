import { authServiceInstance } from "../services/auth.service";
import { Request, Response } from "express";

class authController{
    public async signUp(req: Request, res: Response){
        const {name,email,password} = req.body
        if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing name, email, or password.' });
    }
        try{
        const response  = await authServiceInstance.signUp(name,email,password)
        res.status(200).json(
            { 
        message: 'User registered successfully.', 
        token: response.token, 
        user: response.user 
      }
        )
        }catch(error: any){
           if (error.message.includes('exists')) {
        return res.status(409).json({ error: error.message });
      }
      console.error(error);
      return res.status(500).json({ error: 'Internal server error during registration.' });
        }
    }

    public async signIn(req: Request, res: Response){
        const {email,password} = req.body
        try{
        const response  = await authServiceInstance.signIn(email,password)
        res.status(200).json(
            { 
        message: 'User logged in successfully.', 
        token: response.token, 
        user: response.user 
      }
        )
        }catch(error: any){
            console.error(error);
            return res.status(500).json({ error: 'Internal server error during login.' });
        }
    }

    public async logout(req: Request, res: Response){
        const {userId} = req.body
        try{
        const response  = await authServiceInstance.logout(userId)
        res.status(200).json(
            { 
        message: 'User logged out successfully.', 
      }
        )
        }catch(error: any){
            console.error(error);
            return res.status(500).json({ error: 'Internal server error during logout.' });
        }
    }
}

export const authControllerInstance = new authController();