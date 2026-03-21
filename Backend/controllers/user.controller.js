import User from "../models/user.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export const register = async (req ,res)=>{
    try {
        const {fullName,email,phoneNumber,password,role} = req.body;
        if(!fullName || !email || !phoneNumber || !password || !role){
            return res.status(400).json({message:"All fields are required", success:false});
        };
        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({message:"User already exists with this email ID", success:false});
        };
        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = new User({fullName,email,phoneNumber,password:hashedPassword,role});
        await newUser.save();
        return res.status(201).json({message:"User registered successfully", success:true});

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Something went wrong",
            success: false,
            error: error.message,
        });
    }
}

export const login = async (req,res)=>{
    try {
        const {email,password,role} = req.body;
        if(!email || !password, !role){
            return res.status(400).json({message:"All fields are required", success:false});
        };

        const user = await User.findOne({email});   
        if(!user){
            return res.status(400).json({message:"User not found", success:false});
        };
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){   
            return res.status(400).json({message:`Hello ${user.fullName}, your password is incorrect.`, success:false});
        };

        if (role !== user.role) {
            return res.status(400).json({message:`Hello ${user.fullName}, Account does not match with your role.`, success:false});
        }

        const tokenData = { id: user._id}

        const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1h' });

        const responseUser = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000, sameSite: 'strict', secure: true}).json({message:"Hi " + user.fullName, success:true,responseUser, token});
        

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Something went wrong",
            success: false,
            error: error.message,
        });
    }
}

export const logout = async (req,res)=>{
    try {
        return res.status(200).cookie('token', '', { httpOnly: true, maxAge: 0 }).json({message:"User logged out successfully", success:true});
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Something went wrong",
            success: false,
            error: error.message,
        });
    }
}

export const updateProfile = async (req,res) =>{
    try {
        const {fullName,email,phoneNumber,skills,bio} = req.body;
        if(!fullName || !email || !phoneNumber || !skills || !bio){
            return res.json({message:"All fields are required", success:false});
        };
        const skillsList = skills.split(',');

        const file = req.file;

        const userId = req.id; //From Middleware

        
        const user = await User.findById(userId);
        if(!user){
            return res.json({message:"User not found", success:false});
        };

       user.fullName = fullName;
       user.email = email;
       user.phoneNumber = phoneNumber;
       user.profile.skills = skillsList;
       user.profile.bio = bio;

       user.save();



       user = {
        _id: user._id,
       fullName : user.fullName,
       email : user.email,
       phoneNumber : user.phoneNumber,
       skills : user.profile.skills,
       bio : user.profile.bio};

       res.json({message:"Profile updated successfully", success:true,});


       
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Something went wrong",
            success: false,
            error: error.message,
        });
    }
}