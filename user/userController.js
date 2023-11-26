const userModel = require('./userModel'); 
const jwt = require('jsonwebtoken');
const cookie = require('cookie') ;
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
        if(result === "Email exist"){
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
      if(data.provider&&data.email&&data.password){
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
            return res.status(200).json({data : result}) ;
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


const userProfile = (req, res) =>{
    const token_string = req.headers.authorization ;
    console.log(req.headers)
    console.log(token_string) ;
    if(!token_string){
        return res.status(401).json({error : 'no token'}) ;
    }
    else if (!token_string.startsWith('Bearer ')){
        console.log('lack of "Bearer "') ;
        return res.staus(403).json({error : 'lack of "Bearer "'}) ;
    }
    const token = token_string.replace('Bearer ', '') ;
    jwt.verify(token, process.env.secretKey, (err, decoded) => {
        if (err) {
            console.log("can not decode") ;
          return res.status(403).json({error: "can not decode"});
        }else{
          if(decoded.provider&&decoded.name&&decoded.email) {
                const response = {} ;
                response.provider = decoded.provider ;
                response.name = decoded.name ;
                response.email = decoded.email ;
                response.picture = decoded.picture ;
                console.log({data:response}) ;
                return res.status(200).json({data : response}) ;
            }else{
                console.log("wrong jwt") ;
                return res.status(403).json({error : "wrong jwt"}) ;
            }
        }
    })
}

module.exports  = {insertUser, signinUser, userProfile} ;