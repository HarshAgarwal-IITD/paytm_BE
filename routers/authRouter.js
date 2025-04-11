import { Router } from "express";
import {userModel,accountModel , otpModel} from "../db.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
const authRouter = Router();
import dotenv from 'dotenv'
import {z} from 'zod';
import {sendEmail}  from "../utils/sendMail.js";

dotenv.config();
const JWT_SECRET= process.env.JWT_SECRET;

const signupSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    email: z.string().email("Invalid email address"),
});

const signinSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});


const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
};



authRouter.post("/signup", async (req, res) => {
    try {
      
        // Handle signup logic here
        const { email , otp } = req.body;
        
        const userOtp =await  otpModel.findOne({ email});
        const dbOtp = userOtp.otp;
        const password = userOtp.password;
        const username = userOtp.username;
        console.log(otp,dbOtp,password , username)
        if(dbOtp != otp){
          res.status(400).json({message:"incorrect otp"});
          return;
        }
        
        // Encrypt the password
       

        const newUser = new userModel({ username, email, password });
        await newUser.save();
        const newAccount = await accountModel.create({userId:newUser._id,balance:1000});

        res.status(201).json({ message: "Signup successful", data: { username, email } });
    } catch (error) {
        res.status(400).json({ error: error.errors , message:"error signing up" });
    }
});
authRouter.post('/sendOtp', async(req,res)=>{
    const {  email ,username,password} = req.body;
    console.log(req.body)
    const user = await userModel.findOne({email});
    if(user){
      res.status(500).json({
        message:"user already exists"
      });
    }

  const otp = generateOTP();

  try {
    // Save user with "pending" or "unverified" status and OTP
    const hashedPassword = await bcrypt.hash(password,10);
    const newOtp = new otpModel({
      email,otp ,username,password:hashedPassword
      });

    await newOtp.save();

    await sendEmail(email, "Your OTP Code", `Your OTP is: ${otp}`);

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error during sending otp");
  }
})
authRouter.post("/signin", async (req, res) => {
    try {
        const validatedData = signinSchema.parse(req.body);
        // Handle signin logic here
        const {email , password}=validatedData;
        const validate =await  userModel.findOne({email });
        if(!validate){
           return  res.status(400).json({message:"user not found"});
        }
        if(! await bcrypt.compare(password , validate.password)){
            return res.status(400).json({message:"incorrect password "});
        }
        const token = jwt.sign(
            { email ,userId:validate._id }, // Payload
            JWT_SECRET, // Secret key
            { expiresIn: '1h' } // Options (e.g., token expires in 1 hour)
          );
        res.status(200).json({ message: "Signin successful",
            username:validate.username
            , token : token });
    } catch (error) {
        res.status(400).json({error:error.errors , message:"error signing in"})
    }
}
)


export default authRouter;