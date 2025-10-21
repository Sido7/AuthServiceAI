import connectRedis, {CACHE_EXPIRATION_SECONDS} from "../config/redis.config";
import Redis from "ioredis";


class redisService {
 public static  readonly prefix = "user:"

 public async getRedisCLient ()
 { 
       const redisClient  = await connectRedis()
       return redisClient
 }
 public async cacheUser(User:any){
    const redisClient: Redis = await this.getRedisCLient()
    const key = `${redisService.prefix}${User.id}`
    const userData = JSON.stringify({
        userId: User.id,
        name: User.name,
        email: User.email,
        role: User.role
    })
    await redisClient.set(key, userData, "EX", CACHE_EXPIRATION_SECONDS) 
 }

 public async getCachedUser(id: number){
    const redisClient: Redis = await this.getRedisCLient()
    const key = `${redisService.prefix}${id}`
    const userData = await redisClient.get(key)
    return userData ? JSON.parse(userData) : null
 }

 public async invalidateCachedUser(userId: any): Promise<void> { 
    const redisClient: Redis = await this.getRedisCLient()
    const key = `${redisService.prefix}${userId}`
    await redisClient.del(key)
 }
   
}

export const  cacheService = new redisService();