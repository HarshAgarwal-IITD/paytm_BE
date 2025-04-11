import { Router } from "express";

import {userModel,accountModel} from "../../db.js";
import authMiddleware from "../../middlewares/ middleware.js";


const userRouter = Router();

userRouter.use(authMiddleware);

userRouter.get("/getUsers/:username?", async (req, res) => {
    const username = req.params.username|| ""; // Accessing the 'username' parameter from the request
   
    try {
        const users = await userModel.find({ username: { $regex: username, $options: "i" } }).select("username email"); // Fetch users starting with the given username
        
       return res.status(200).json(users);
    } catch (error) {
        res.status(500).send("Error fetching users");
    }
});
userRouter.get("/balance", async(req , res)=>{
    try{
        const {userId} = req.email;
        
        console.log('id found ' , userId)
        const user = await accountModel.findOne({userId });
        const balance = user.balance;
        return res.status(200).json({message:"balance fetched successfuly", balance});
    }
    catch(e){
        return res.status(500).json({message:"error fetching balance", error:e})
    }
})
export default userRouter;
