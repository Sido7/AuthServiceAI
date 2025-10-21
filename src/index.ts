import { EntityMetadata } from 'typeorm';
import express, {Request, Response} from 'express';
import AppDataSource from './config/db.connection';
import dotenv from 'dotenv'
import routes from "./routes/index"
 

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({ message: 'User Service is running.', dbStatus: 'Pending' });
});

app.use('/v1', routes)



const Port  = process.env.port || 3001
app.listen(Port, async () => {
    await AppDataSource.initialize();
    console.log(`⚡ Server listening on port ${Port}`);
    console.log(`Access the service at http://localhost:${Port}`);
});