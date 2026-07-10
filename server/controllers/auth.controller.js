import UserModel from "../models/user.model.js";
import { getToekn } from "../utils/token.js";

export const googleAuth=async(req,res)=>{
  try {
      const {name,email} = req.body || {};

    let user = await UserModel.findOne({email});

    if(!user){
        user = await UserModel.create({
            name,email
        })
    }
    const toekn = await getToekn(user._id)
    res.cookie('token',toekn,{
        httpOnly:true,
        secure:false,
        samesite:'strict',
        maxAage:7*24*60*60*1000
    })
    return res.status(200).json(user)
  } catch (error) {
    console.log('error', error)   
    return res.status(500).json({message:"error"}) 
  }
}


export const logOut= async(req,res)=>{
  try {
    await res.clearCookiee("token");
    return res.status(200).json({message:"Logout"})
  } catch (error) {
    
  }
}