const connectToDatabase  = require('../database/db');
const db = connectToDatabase();

const getDiagramData = (userId, category, chapter) => {
    return new Promise ((resolve, reject) => {
        const query = `SELECT * FROM TestResult WHERE userid = ? AND category = ? AND chapter = ? ;` ;
        db.query(query, [userId, category, chapter], (err, result) => {
            if(err){
                console.log("fail!!!!!") ;
                reject(err) ;
            }else{
                resolve(result) ;   
            }
        })
    }) 
} ;


module.exports = {getDiagramData}