import { Router } from "express";
import bcrypt from "bcrypt";
import {userModel} from "../../db.js";
import authMiddleware from "../../middlewares/ middleware.js";
const updateRouter = Router();

updateRouter.use(authMiddleware);

updateRouter.put('/username',async (req ,res)=>{
    const { newUsername } = req.body;
    const {email} = req.email; // Assuming `authMiddleware` attaches the user to `req.user`
    try {
        
        const user = await userModel.findOneAndUpdate(
            { email: email },
            { username: newUsername },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "Username updated successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error updating username", error: error.message });
    }
})

updateRouter.put('/password',async (req ,res)=>{
    const { newPassword } = req.body;
    console.log(req.body)
    const {email} = req.email; // Assuming `authMiddleware` attaches the user to `req.user`
    try {
        const newHashedPassword = await bcrypt.hash(newPassword, 10);
        const user = await userModel.findOneAndUpdate(
            { email: email },
            { password: newHashedPassword },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "password updated successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error updating password", error: error.message });
    }
})
export default updateRouter;