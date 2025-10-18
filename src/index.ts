import express, {Request, Response} from 'express';
import AppDataSource from './config/db.connection';
import dotenv from 'dotenv'
import { User } from './entity/user.entity';

dotenv.config();

const app = express();

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({ message: 'User Service is running.', dbStatus: 'Pending' });
});
const userdata = {
    name: "John Doe",
    email: "Tt7mI@example.com",
    password: "password123",
    role: "user"
}

const userRepo = AppDataSource.getRepository(User);
const Port  = process.env.port || 3001
app.listen(Port, async () => {
    await AppDataSource.initialize();
    console.log(`⚡ Server listening on port ${Port}`);
    console.log(`Access the service at http://localhost:${Port}`);
    userRepo.save(userdata);
});