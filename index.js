import express from 'express'
import authRouter from './routers/authRouter.js';
import updateRouter from './routers/authenticatedRoutes/updateRouter.js';
import userRouter from './routers/authenticatedRoutes/userRouter.js';
import transactionsRouter from './routers/authenticatedRoutes/transactionsRouter.js';
import cors from 'cors';


const app = express();

import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();

const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL);
console.log('connected to mongo database');
app.use(cors())
app.use(express.json());

app.use("/api/v1/auth",authRouter);
app.use("/api/v1/update",updateRouter);
app.use('/api/v1/user',userRouter);
app.use('/api/v1/transaction',transactionsRouter)
app.listen(3000);
console.log('app running on localhost:3000');


  


