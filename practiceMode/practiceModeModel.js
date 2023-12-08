const connectToDatabase  = require('../database/db');
const db = connectToDatabase();

const getWords = (category, chapter) => {
    return new Promise((resolve, reject) => {
        const queryWords = `
        SELECT Word.*
        FROM Word
        JOIN Category ON Word.category = Category.id 
        WHERE Category.category = ? and Word.chapter = ? ;
        ` ;
        db.query(queryWords, [category, chapter], (err, result) => {
            if (err) {
                console.log("get words fail") ;
                reject(err) ;
            }else{
                resolve(result) ;
            }
        }) ;
    }) ;     
} ;

const addFavorite = (userId, wordId) =>{
    return new Promise((resolve, reject) => {
        const insertFavorite = `INSERT INTO Favorite (userid, wordid) values (?,?) ;` ;
        db.query(insertFavorite, [userId, wordId], (err, result) => {
            if(err){
                console.log("add Favorite fail", err) ;
                reject(err) ;
            }else{
                resolve(result) ;
            }
        }) ;
    }) ;
} ;

const queryFavorite = (userId, wordId) => {
    return new Promise((resolve, reject) => {
        const queryFavorite = `SELECT* FROM Favorite WHERE userId = ? and wordId = ? ;` ;
        db.query(queryFavorite, [userId, wordId], (err, result) => {
            if(err){
                console.log("query Favorite fail", err) ;
                reject(err) ;
            }else{
                resolve(result) ;
            }
        }) ;
    }) ;
}

const deleteFavorite = (userId, wordId) => {
    return new Promise((resolve, reject) => {
        const queryFavorite = `DELETE FROM Favorite WHERE userId = ? and wordId = ? ;` ;
        db.query(queryFavorite, [userId, wordId], (err, result) => {
            if(err){
                console.log("query Favorite fail", err) ;
                reject(err) ;
            }else{
                resolve() ;
            }
        }) ;
    }) ;
}

module.exports = {getWords,addFavorite, queryFavorite, deleteFavorite} ;