const jwt = require('jsonwebtoken');
const tokenModel = require('./tokenModel') ;
const cookie = require('cookie') ;
require('dotenv').config();
const secretKey = process.env.JWT_SECRETKEY;

const checkJwtToken = async (req, res, next) => {
    try {
        const parseCookie = cookie.parse(req.headers.cookie) ;
        const token = parseCookie.token ;
        const decode = await jwt.verify(token, secretKey);
        if( decode.id&&
            decode.name&&
            decode.email&&
            decode.access_expired&&
            decode.iat&&
            decode.role&&
            Math.floor(Date.now()/1000) < (decode.iat + decode.access_expired) ){
            req.role = decode.role ;
            next() ;  
        }else{
            return res.status(401).json({err : 'Unauthorized'}) ;
        }
        
    }catch(error){
        if (error.message === "jwt must be provided"){
            return res.status(400).json({err: "Unauthorized"}) ;
        }
        return res.status(500).json({err : 'Internal server error'}) ;
    }
}

const checkAuth = (route) => async(req, res, next) => {
    try{
        const result = await tokenModel.checkAuth(route, req.role) ;
        if(result === 1){
            next() ;
        }else{
            return res.status(403).json({err : "Forbidden"})
        }
    }catch(err){
        return res.status(500).json({err : "query auth error"}) ;
    }
} 

module.exports = {checkJwtToken, checkAuth};