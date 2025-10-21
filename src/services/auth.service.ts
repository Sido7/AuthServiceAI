import { Repository } from "typeorm";
import AppDataSource from "../config/db.connection";
import { User } from "../entity/user.entity";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { cacheService } from "./redis.service";

dotenv.config();


class authService{
    private userRepository: Repository<User>;
    constructor(){
        this.userRepository = AppDataSource.getRepository(User);
    }

    private generateToken(user: User): string{
        const payload = {
            id: user.id,
            email: user.email,
        }

        return jwt.sign(payload, process.env.jwt_secrets || '', {expiresIn:'1h'});
    }

    public async signUp(name: string, email: string, password: string,){
        const userExit = await this.userRepository.findOneBy({email: email});
        if(userExit){
            throw new Error('User already exist');
        }

        const userInfo = this.userRepository.create({
            name,
            email,
            hashed_password: password,
            role: 'user'
        });
        await this.userRepository.save(userInfo);
        const token = this.generateToken(userInfo);
        await cacheService.cacheUser(userInfo)
        return {token, user:{user_id: userInfo.id, name: userInfo.name, email: userInfo.email, role: userInfo.role}};

    }

    public async signIn(email: string, password: string){
           const userInfo = await this.userRepository.findOneBy({email: email});
           if(!userInfo || !userInfo.checkPassword(password)){
               throw new Error('Invalid email or password');
           }
           if(!userInfo.is_active){
               throw new Error('User is inactive');
           }
           const token = this.generateToken(userInfo);
           await cacheService.cacheUser(userInfo)
           return {token, user:{user_id: userInfo.id, name: userInfo.name, email: userInfo.email, role: userInfo.role}}

    }

    public async logout(userId: any){
        await cacheService.invalidateCachedUser(userId)
    }
}

export const authServiceInstance = new authService();