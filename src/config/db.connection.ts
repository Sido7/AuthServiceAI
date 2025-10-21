import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "../entity/user.entity"
import dotenv from 'dotenv'

dotenv.config();



const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.db_host || 'localhost',
    port: 3306,
    username: 'root',
    password: process.env.db_password || '',
    database: process.env.db_name || '',
    entities: [User],
    synchronize: true   // keep it false for production, otherwise it will drop the tables
})

export default AppDataSource