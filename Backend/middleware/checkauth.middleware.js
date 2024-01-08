const jwt=require('jsonwebtoken');
const {ErrorHandler}=require('../util/error');

const Authuser=require("../models/authuser.model");

const checkAuth=async (req,res,next)=>{
    try{
        // const token=req.cookies.token;
        if(!req.headers.authorization){
            throw new ErrorHandler(400,"Authentication failed");
        }
        const token=req.headers.authorization.split(" ")[1];
        if(!token){
            throw new ErrorHandler(400,"Authentication failed");
        }
        const decoded=jwt.verify(token,process.env.KEY);
        req.userData={userId:decoded.userId};
        const user = await Authuser.findById(req.userData.userId);
        if(user.payment==false){
            throw new ErrorHandler(401,"User has not paid");
        }
        next();
    }
    catch(error){
        next(error);
        // throw new ErrorHandler(400,"Authentication failed");
    }
}

const checkAuthpayment=async (req,res,next)=>{
    try{
        // const token=req.cookies.token;
        if(!req.headers.authorization){
            throw new ErrorHandler(400,"Authentication failed");
        }
        const token=req.headers.authorization.split(" ")[1];
        if(!token){
            throw new ErrorHandler(400,"Authentication failed");
        }
        const decoded=jwt.verify(token,process.env.KEY);
        req.userData={userId:decoded.userId};
        next();
    }
    catch(error){
        next(error);
        // throw new ErrorHandler(400,"Authentication failed");
    }
}

module.exports={checkAuth,checkAuthpayment};