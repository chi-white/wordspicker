const crypto = require('crypto');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const connectToDatabase  = require('../database/db');
const db = connectToDatabase();


const checkEmailquery = (email) =>{
    return new Promise((resolve, reject)=>{
        const checkEmailquery = `SELECT * FROM User WHERE email = ? LIMIT 1;` ;
        db.query(checkEmailquery, [email], (err, result)=>{
            if(err){
              console.log("Check email fail") ;
              reject(err)
            }else if (result.length === 1){
                console.log("Email exist") ;
                resolve("Email exist") ;
            }else{
                resolve(true) ;
            }
        });
    });
};


const insertUser = async (userdata) => {
    const { email, name, password } = userdata;
    try {
      const result = await checkEmailquery(email);
      if (result === "Email exist") {
        return Promise.resolve(result);
      } else{

        const hash = crypto.createHash('sha256').update(password).digest('hex');
        const insertUserQuery = `INSERT INTO User (email, name, password, picture) VALUES (?, ?, ?, ?);`;
        return new Promise((resolve, reject) =>{
         db.query(insertUserQuery, [email, name, hash, null], (err, result) => {
            if (err) {
                console.error("Error inserting user:", err.stack);
                reject(err) ;
            } else {
                const userid = result.insertId ;
                const eccess_expired = 3600 ;
                const payload = {
                    "provider" : "native" ,
                    "name" : name,
                    "email" : email,
                    "access_expired" : eccess_expired,
                    //"iat" => auto create"
                }
                const token = jwt.sign(payload, process.env.secretKey) ;
                const userinfo = {} ;
                const response = {} ;
                userinfo.id = userid ;
                userinfo.provider = "native" ;
                userinfo.name = name ;
                userinfo.email = email ;
                userinfo.picture = "test.png" ;
                response.access_token = token ;
                response.access_expired = eccess_expired ;
                response.user = userinfo ;
                resolve(response) ;
            }
          });
       })
      }
    }catch (err) {
      console.log('Error checking email: ' + err.stack);
      throw err; 
    }
  };


const signinUser = (userdata) => {
  return new Promise((resolve, reject) => {   
      const {email, password, provider} = userdata ;
      const UserQuery = `SELECT * FROM User WHERE email = ? AND password = ?;`
      const hash = crypto.createHash('sha256').update(password).digest('hex');

      db.query(UserQuery, [email, hash], (err, result)=>{
        if(err){
          console.log(err) ;
          reject(err) ;
        }else{
          if (result.length === 0){
            resolve("wrong password or email") ;
          }else{
            const userinfo = {} ;
            const response = {} ;
            const eccess_expired = 3600 ;
            const payload = {
              "provider" : "native" ,
              "name" : result[0].name,
              "email" : result[0].email,
              "picture" : result[0].picture,
              "role" : result[0].role,
              "access_expired" : eccess_expired,
              //"iat" => auto create"
            }
            const token = jwt.sign(payload, process.env.secretKey) ;
            userinfo.id = result[0].id ;
            userinfo.provider = "native" ;
            userinfo.name = result[0].name ;
            userinfo.email = result[0].email ;
            userinfo.picture = result[0].picture ;
            response.access_token = token ;
            response.access_expired = eccess_expired ;
            response.user = userinfo ;
            resolve(response) ;
          }
        } 
      })
  })
}


module.exports = {insertUser, signinUser} ;