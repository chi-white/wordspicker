const mainModel = require('./mainModel') ;
const jwt = require('jsonwebtoken');
const cookie = require('cookie') ;
require('dotenv').config();
const secretKey = process.env.JWT_SECRETKEY;

const getDiagramData = async (req, res) => {
    try{
        const category = req.query.category ;
        const chapter = req.query.chapter ;
        const parseCookie = cookie.parse(req.headers.cookie) ;
        const token = parseCookie.token ;
        const decode = jwt.verify(token, secretKey);
        const userId = decode.id ; 
        const result = await mainModel.getDiagramData(userId, category, chapter) ;
        console.log("con", result) ;
        return res.status(200).json({data:result})
    }catch(err){
        console.log(err) ;
        return res.status(500).json({err:err}) ;
    }
} ;

module.exports = {getDiagramData} ;