const connectToDatabase  = require('../database/db');
const db = connectToDatabase();

const getChapter = (category) =>{
    return new Promise((resolve, reject)=>{
        const checkChapter = `
            SELECT Chapter.chapter
            FROM Chapter 
            JOIN Category ON Chapter.category = Category.id
            WHERE Category.category = ? ;` ;
        db.query(checkChapter, [category], (err, result)=>{
            if(err){
              console.log("Check chapter fail") ;
              reject(err) ;
            }else{
                resolve(result) ;
            }
        });
    });
};

module.exports = {getChapter} ;