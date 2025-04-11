import { Router } from "express";
import mongoose from "mongoose";
import {accountModel, transactionModel} from "../../db.js";
import authMiddleware from "../../middlewares/ middleware.js";

const transactionsRouter = Router();

  
transactionsRouter.use(authMiddleware);

transactionsRouter.post("/transfer",async(req , res)=>{
    let {receiverId , amount}= req.body ;
    receiverId = new mongoose.Types.ObjectId(receiverId);
    console.log(req.body)
    
    const{userId}= req.email;
    const session = await mongoose.startSession();
    session.startTransaction();

    try{
        const sender =await accountModel.findOneAndUpdate({ userId, balance:{$gte:amount}},
            {$inc : { balance:-amount}},
            {new:true ,session}
        )
        if (!sender) {
            return res.status(400).json({message:"insufficient balance or user not found"}) ;
          }
        const receiver =await accountModel.findOneAndUpdate({userId : receiverId} , {$inc:{balance:amount}}, { new: true, session });
        if(!receiver){
            return res.status(400).json({message:'receiver not found'});

        }
        await transactionModel.create([{senderId:userId , amount , receiverId,status:"SUCCESS"}],
            {session}
        )
        await session.commitTransaction();
        session.endSession();
        return res.status(200).json({message:"transaction sucees"});
    }
    catch(e){
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({message:"transaction failed", error:e});
    }
})

export default transactionsRouter;