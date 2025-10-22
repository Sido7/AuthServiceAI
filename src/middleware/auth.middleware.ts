import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction, json } from 'express';
import { User } from '../entity/user.entity';
import { cacheService } from '../services/redis.service';
import AppDataSource from '../config/db.connection';


 const userRepository = AppDataSource.getRepository(User);
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {

   
    const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    try {
        const decoded = jwt.verify(token, process.env.jwt_secrets || '') as User;
        const userId = decoded.id;
        const userCached = await cacheService.getCachedUser(userId);
        if(userCached){
            try{
                const parsedUser = JSON.parse(userCached);
                if(!parsedUser.is_active){
                await cacheService.invalidateCachedUser(userId);
                return res.status(401).json({ error: 'Unauthorized' });
            }
            (req as any).user = JSON.parse(userCached);
            return next();
            }catch(jsonError){
              
                console.error('Malformed cache data for user:', userId, jsonError);
                await cacheService.invalidateCachedUser(userId);
            
            }
        }
            const userInfo = await userRepository.findOneBy({ id: decoded.id });
            if (!userInfo || !userInfo.is_active) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            await cacheService.cacheUser(userInfo)
            const userpayload =  
            (req as any).user = {
                 id: userInfo.id,
                 name: userInfo.name,
                 email: userInfo.email
            //     role: userInfo.role
            };
        
        
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
}