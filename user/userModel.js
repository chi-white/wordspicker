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
                if (result.provider !== 'native'){
                  console.log("Email registered by other authentications") ;
                  resolve("Email registered by other authentications") ;
                }else{
                console.log("Email exist") ;
                resolve("Email exist") ;
                }
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
      if (result === "Email exist" || result === "Email registered by other authentications") {
        return Promise.resolve(result);
      } else{
        const hash = crypto.createHash('sha256').update(password).digest('hex');
        const insertUserQuery = `INSERT INTO User (email, name, password) VALUES (?, ?, ?);`;
        return new Promise((resolve, reject) =>{
         db.query(insertUserQuery, [email, name, hash], (err, result) => {
            if (err) {
                console.error("Error inserting user:", err.stack);
                reject(err) ;
            } else {
                const userid = result.insertId ;
                const userinfo = {} ;
                const response = {} ;
                userinfo.id = userid ;
                userinfo.provider = "native" ;
                userinfo.name = name ;
                userinfo.email = email ;
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

const googleUserExist = (userdata) => {
  return new Promise((resolve, reject)=>{
    const {email} = userdata ;
    const checkQuery = `SELECT * FROM User WHERE email = ? LIMIT 1 ;` ;
    db.query(checkQuery, [email], (err, result) => {
      if(err){
        console.log("check google user exist fail") ;
        reject("exist fail") ;
      }else{
        if (result.length === 1){
          resolve("exist") ;
        }else{
          resolve("no exist") ;
        }
      }
    })
  })
}

const googleUserInsert = (userdata) => {
  return new Promise((resolve, reject) => {
    const {email, name} = userdata ;
    const provider = 'google' ;
    const insertQuery = `INSERT INTO User (email, name, password, provider) VALUES (?, ?, ?, ?) ;` ;
    db.query(insertQuery, [email, name, null, provider], (err, result) => {
      if(err){
        console.log("insert google user fail") ;
        reject("insert fail") ;
      }else{
        resolve(true) ;
      }
    })
  })
}

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
              "name" : result[0].name,
              "email" : result[0].email,
              "role" : result[0].role,
              "access_expired" : eccess_expired,
              //"iat" => auto create"
            }
            const token = jwt.sign(payload, process.env.JWT_SECRETKEY) ;
            userinfo.id = result[0].id ;
            userinfo.provider = result[0].provider ;
            userinfo.name = result[0].name ;
            userinfo.email = result[0].email ;
            response.access_token = token ;
            response.access_expired = eccess_expired ;
            response.user = userinfo ;
            resolve(response) ;
          }
        } 
      })
  })
}


module.exports = {insertUser, signinUser, googleUserExist, googleUserInsert} ;