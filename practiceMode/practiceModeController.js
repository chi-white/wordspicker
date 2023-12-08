const practiceModeModel = require('./practiceModeModel') ;
const jwt = require('jsonwebtoken');
const cookie = require('cookie') ;
require('dotenv').config();
const secretKey = process.env.JWT_SECRETKEY;

const getWords = async (req, res) => {
    const category = req.query.category;
    const chapter = req.query.chapter ;
    try{
        const result = await practiceModeModel.getWords(category, chapter) ;
        return res.status(200).json({data:result}) ;
    }catch(err){
        console.log("getWords fail") ;
        return res.status(500).json({err:err})
    }
} ;

const addFavorite = async(req, res) => {
    try{
        const wordId = req.query.wordId ;
        const parseCookie = cookie.parse(req.headers.cookie) ;
        const token = parseCookie.token ;
        const decode = await jwt.verify(token, secretKey);
        const userId = decode.id ; 
        const result = await practiceModeModel.addFavorite(userId, wordId) ;
        console.log('add', wordId) ;
        return res.status(200).json({data:result}) ;
    }catch(err){
        console.log("add Favorite fail", err) ;
        return res.status(500).json({err:err}) ;
    }
} ;

const queryFavorite = async(req, res) => {
    try{
        const wordId = req.query.wordId ;
        const parseCookie = cookie.parse(req.headers.cookie) ;
        const token = parseCookie.token ;
        const decode = await jwt.verify(token, secretKey);
        const userId = decode.id ; 
        const result = await practiceModeModel.queryFavorite(userId, wordId) ;
        return res.status(200).json({data:result}) ;
    }catch(err){
        console.log("query Favorite fail", err) ;
        return res.status(500).json({err:err}) ;
    }
}

const deleteFavorite = async(req, res) => {
    try{
        const wordId = req.query.wordId ;
        const parseCookie = cookie.parse(req.headers.cookie) ;
        const token = parseCookie.token ;
        const decode = await jwt.verify(token, secretKey);
        const userId = decode.id ; 
        console.log("controller log", userId, wordId) ;
        const result = await practiceModeModel.deleteFavorite(userId, wordId) ;
        console.log('delete', wordId) ;
        return res.status(200).json({data:"OK"}) ;
    }catch(err){
        console.log("delete Favorite fail", err) ;
        return res.status(500).json({err:err}) ;
    }
}

module.exports = {getWords, addFavorite, queryFavorite, deleteFavorite} ;