import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const accountSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Types.ObjectId,
        ref:"user",
        unique:true,
        required : true,
    },
    balance:{
        type:  Number ,//in paise
    }

})
const otpSchema = new mongoose.Schema(
    {
        otp:{
            type:Number,
            required:true,
        },
        email:{
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        username:{
            type: String,
            required: true,
            unique: true
                },
        password:{
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            expires: 60 * 5, // The document will be automatically deleted after 5 minutes of its creation time
          },
    }
)

const transactionSchema = new mongoose.Schema(
    {
      senderId: { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: "user", 
          required: true 
      },
      receiverId: { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: "user", 
          required: true 
      },
      amount: { 
          type: Number, 
          required: true 
      },
      status: { 
          type: String, 
          enum: ["PENDING", "SUCCESS", "FAILED"], 
          default: "PENDING" 
      },
    },
    { timestamps: true } // Auto-adds `createdAt`
  );

export const transactionModel = mongoose.model('transaction',transactionSchema)
export const userModel = mongoose.model("user",UserSchema);
export const accountModel = mongoose.model("account",accountSchema);
export const otpModel = mongoose.model("userOtp",otpSchema);


