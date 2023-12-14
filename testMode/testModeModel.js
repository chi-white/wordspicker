const connectToDatabase  = require('../database/db');
const db = connectToDatabase();
require('dotenv').config();
const learningRate = process.env.LEARNING_RATE;

const setTestWords = (category, chapter, questionNumber) => {
    return new Promise((resolve, reject) => {
        const queryWords = `
        SELECT Word.english, Word.chinese, Word.abbreviation, Word.id
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
                console.log(result, "form model") ;
                resolve(result) ;
            }
        }) ;
    }) ;     
} ;

const check = (category, chapter, userid) => {
    return new Promise((resolve, reject) => {
        const query = `
        SELECT Error.wordid, Error.prob
        FROM Error 
        JOIN Word ON Error.wordid = Word.id
        JOIN Category ON Word.category = Category.id
        WHERE Error.userid = ?
        AND Category.category = ?
        AND Word.chapter = ? ;

        ` ;
        db.query(query, [userid, category, chapter], (err, result) =>{
            if(err){
                reject(err) ;
            }else{
                resolve(result) ; 
            }
        }) ;
    }) ;
} ;

const queryWordId = (category, chapter) => {
    return new Promise((resolve, reject) => {
        const query = `
        SELECT Word.id 
        FROM Word
        JOIN Category ON Word.category = Category.id 
        WHERE Category.category = ? AND Word.chapter = ? ;` ;
        db.query(query, [category, chapter], (err, result) => {
            if(err){
                reject(err) ;
            }else{
                console.log("queryWordId") ;
                resolve(result) ;
            }
        }) ;
    }) ;
} ;

const insertRecord = (userid, wordId, prob) => {   
    console.log("insertRecord", wordId) ;
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO Error (userid, wordid, prob) VALUES (?,?,?)` ;
        db.query(query, [userid, wordId, prob], (err, result) => {
            if (err){
                reject(err) ;
            }else{
                console.log("resolve") ;
                resolve() ;
            }
        }) ;
    }) ;
} ;

const weightedRandomSelection = (options, numberOfSelections) => {
    const selectedOptions = [];
    for (let i = 0; i < numberOfSelections; i++) {
      options = options.map(option => ({ ...option, prob: parseFloat(option.prob) }));
  
      const totalWeight = options.reduce((sum, option) => sum + option.prob, 0);
      let randomValue = Math.random() * totalWeight;
      for (const option of options) {
        randomValue -= option.prob;
        if (randomValue <= 0) {
          selectedOptions.push(option);
          options.splice(options.indexOf(option), 1);
          break;
        }
      }
    }
    return selectedOptions;
  }

const queryReturn = (id) => {
    return new Promise((resolve, reject)=> {
        const query = `SELECT english, chinese, abbreviation, id FROM Word WHERE id = ? ;`;
        db.query(query, [id], (err, result) => {
            if(err){
                reject(err) ;
            }else{
                console.log("from model", result[0]) ;
                resolve(result[0]) ;
            }
        });

    });
} ;


const setTestWordsWithProb = (category, chapter, questionNumber, userid) => {
    return new Promise (async (resolve, reject) => {
        const exist = await check(category, chapter, userid) ;
        if(exist.length == 0){
            console.log("enter") ;
            const wordsId = await queryWordId(category, chapter) ;
            const wordNumber = wordsId.length ;
            for(let wordId of wordsId){
                await new Promise(async (resolve, reject) => {
                    await insertRecord(userid, wordId.id, 1/wordNumber) ;
                    resolve() ;
                });
            }
        }
        
        const data = await check(category, chapter, userid) ;
        const selection = weightedRandomSelection(data, 2) ;
        const selectionId = selection.map(data => data.wordid) ;
        const returnData = [] ;
        for (let id of selectionId){
            console.log("id", id) ;
            const info = await queryReturn(id) ;
            returnData.push(info) ;
        }
        resolve(returnData) ;
    })
}

const adjustProb = async (userid, wordid, score) => {
    return new Promise( async (resolve, reject) => {
        const queryOrigin = `SELECT prob FROM Error WHERE userid = ? AND wordid = ? ;` ;
        db.query(queryOrigin, [userid, wordid],(err, result) => {
            const newProb = result[0].prob*(1-learningRate) + score*learningRate ;
            console.log("newProb",newProb) ;
            const query = `UPDATE Error SET prob = ? WHERE userid = ? AND wordid = ?;` ;
            db.query(query, [newProb, userid, wordid], (err, result) => {
                if(err){
                    reject(err) ;
                }else{
                    console.log("adjustProb solve") ;
                    resolve() ;
                }
            }) ;
        }) ;
    }) ;
    
} ;

const reRangeProb = (userid, category, chapter) => {
    return new Promise(async (resolve, reject) => {
        const query= `
        SELECT SUM(Error.prob) AS probSum
        FROM Error
        JOIN Word ON Error.wordid = Word.id
        JOIN Category ON Category.id = Word.category
        WHERE Error.userid = ?
        AND Category.category = ?
        AND Word.chapter = ?;` ;
        db.query(query, [userid, category, chapter], (err, result) => {
            if(err){
                reject(err) ;
            }else{
                const queryReRange = `
                UPDATE Error
                JOIN Word ON Error.wordid = Word.id
                JOIN Category ON Category.id = Word.category
                SET Error.prob = Error.prob/?
                WHERE Error.userid = ?
                AND Category.category = ?
                AND Word.chapter = ?; `;
                db.query(queryReRange, [result[0].probSum, userid, category, chapter], (err, result) => {
                    if(err){
                        reject(err) ;
                    }else{
                        console.log("rerange resolve") ;
                        resolve() ;
                    }
                });
            }
        }) ;
        
    });
};
module.exports = {setTestWords, setTestWordsWithProb, adjustProb, reRangeProb} ;