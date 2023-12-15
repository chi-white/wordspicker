const connectToDatabase  = require('../database/db');
const db = connectToDatabase();

const checkAuth  = (route, role) => {
    const queryrole = `SELECT ?? FROM Role WHERE role = ?;` ;
    return new Promise((resolve, reject) => {
        db.query(queryrole, [route, role], (err, result)=>{
            if(err){
                console.log("query role error "+err.message) ;
                reject(err) ;
            }else{
                if(result[0][route] === 1){
                    resolve(1) ;
                }else{
                    resolve(0) ;
                }
            }
        })
    })
}

module.exports = {checkAuth} ;