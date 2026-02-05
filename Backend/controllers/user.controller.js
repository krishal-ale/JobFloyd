import User from "../models/user.model.js";
import bcrypt from 'bcrypt';


export const register = async (req ,res)=>{
    try {
        const {fullname,email,phoneNumber,password,role} = req.body;
        if(!fullname || !email || !phoneNumber || !password || !role){
            return res.status(400).json({message:"All fields are required", success:false});
        };
        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({message:"User already exists", success:false});
        };
        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = new User({fullname,email,phoneNumber,password:hashedPassword,role});
        await newUser.save();
        return res.status(201).json({message:"User registered successfully", success:true});

    } catch (error) {
        
    }
}