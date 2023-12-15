const userModel = require('./userModel'); 
const jwt = require('jsonwebtoken');
require('dotenv').config();

const signupinputcheck = (data) => {
    return new Promise((resolve, reject)=>{
      if(data.name&&data.password&&data.email){
        const emailRegex = /\S+@\S+\.\S+/;
        if (emailRegex.test(data.email)){
          resolve(true) ;
        }else{
          
          reject("invalid input") ;
        }
      }else{
        reject("invalid input") ;
      }
    })
  } ;

const insertUser = async (req, res) => {
    try{
        const inputcheck = await signupinputcheck(req.body) ;
        const result = await userModel.insertUser(req.body) ;
        if(result === "Email exist" || result === "Email registered by other authentications"){
            return res.status(403).json({err : result}) ;
        }else{
            return res.status(200).json({data : result}) ;
        } 
    }catch(err){
        if (err === "invalid input"){
            console.log(err) ;
            return res.status(400).json({"err" : err})
        }else{
            console.log("user inserting fail") ;
            return res.status(500).json({"err" : err}) ;
        }
    }
};

const signininputcheck = (data) =>{
    return new Promise((resolve, reject) => {
      if(data.email&&data.password){
        resolve(true) ;
      }else{
        reject("invalid input") ;
      }
    })
  }

const signinUser = async (req, res) => {
    try{
        const inputcheck = await signininputcheck(req.body) ;
        const result = await userModel.signinUser(req.body) ;
        if(result === "wrong password or email"){
            console.log(result) ;
            return res.status(403).json({"err" : result}) ;
        }else{
            res.cookie('token', result.access_token) ; 
            return res.status(200).json({data:result}) ;
        }
        
    }catch(err){
        if (err === "invalid input"){
            console.log(err) ;
            return res.status(400).json({"err" : err})
        }else{
        console.log("internal server err") ;
        return res.status(500).json({"err" : err}) ;
        }
    }
};

const googleInsertUser = async (req, res, next) =>{
  try{
    const exist = await userModel.googleUserExist(req.user['_json']) ;
    if (exist === "no exist"){
      const insert = await userModel.googleUserInsert(req.user['_json']) ;
      req.id = insert ;
    }else{
      req.id = exist ;
    }
    next() ;
  }catch(err){
    if(err === "exist fail"){
      return res.status(500).json({err : "Check google user exist fail"}) ;
    }else if (err === "insert fail"){
      return res.status(500).json({err : "Insert google user fail"}) ;
    }
  }
}

const googlelogin = async (req, res) => {
  try{
    const secretkey = process.env.JWT_SECRETKEY ;
    const expired_t = 3600;
    const userProfile = req.user ;
    const user = {
      id : req.id,
      name : userProfile['_json'].name,
      email : userProfile['_json'].email,  
      role : "user",
      access_expired  : expired_t
    }
    const token = jwt.sign(user,secretkey) ;
    res.cookie('token', token) ;
    res.redirect('/main.html') ;
  }catch(err){
    return res.status(500).json({err : err.message})
  }
}
module.exports  = {insertUser, signinUser, googlelogin, googleInsertUser} ;