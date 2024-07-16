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

const getWords = (category, chapter, questionNumber) => {
    return new Promise((resolve, reject) => {
        const queryWords = `
        SELECT Word.english, Word.chinese, Word.abbreviation
        FROM Word
        JOIN Category ON Word.category = Category.id 
        WHERE Category.category = ? and Word.chapter = ? 
        ORDER BY RAND()
        LIMIT ? ;` ;
        db.query(queryWords, [category, chapter, questionNumber], (err, result) => {
            if(err){
                console.log("get words fail") ;
                reject(err) ;
            }else{
                resolve(result) ;
            }
        }) ;
    });
};

module.exports = {getChapter, getWords} ;