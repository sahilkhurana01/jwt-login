import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";

import connectDB from './config/mongodb.js'
import authRouter from './routes/authRoutes.js'
import userRouter from './routes/userRoutes.js';

const app = express();
const port = process.env.PORT || 4000

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ['https://jwt-login-pi.vercel.app', 'http://localhost:5173', 'https://jwt-login-dmh5figi0-sahil-arts-projects.vercel.app'],
    credentials: true
}))

//API ENDPOINTS
app.get('/',(req,res)=> res.send ("API Working "));
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)



app.listen(port, ()=> console.log(`Server started on PORT:${port}`));
