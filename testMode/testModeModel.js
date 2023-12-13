const connectToDatabase  = require('../database/db');
const db = connectToDatabase();

const setTestWords = (category, chapter, questionNumber) => {
    return new Promise((resolve, reject) => {
        const queryWords = `
        SELECT Word.english, Word.chinese, Word.abbreviation
        FROM Word
        JOIN Category ON Word.category = Category.id 
        WHERE Category.category = ? and Word.chapter = ? 
        ORDER BY RAND()
        LIMIT ?;
        ` ;
        db.query(queryWords, [category, chapter, questionNumber], (err, result) => {
            if (err) {
                console.log("get test words fail") ;
                reject(err) ;
            }else{
                resolve(result) ;
            }
        }) ;
    }) ;     
} ;

module.exports = {setTestWords} ;