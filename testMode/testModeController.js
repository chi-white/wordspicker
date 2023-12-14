const testModeModel = require('./testModeModel') ;
const jwt = require('jsonwebtoken');
const cookie = require('cookie') ;
require('dotenv').config();
const secretKey = process.env.JWT_SECRETKEY;
const learningRate = process.env.LEARNING_RATE;

const generateQuestionType = async (questionNumber, type) => {
    let p ;
    const array = [] ;
    for (let i=0; i<questionNumber; i++){
      if(type === "EtoC"){
        array.push("EtoC") ;
      }else if(type === "CtoE"){
        array.push("CtoE") ;
      }else{
        p = Math.random();
        if(p < 0.5){
            array.push("EtoC") ;
        }else{
            array.push("CtoE") ;
        }
      }
    }
    return array ;
}

const handleTestModeSocket = (io) => {
    const questionType = {} ;
    const questionWords = {} ;  
    io.on('connection', (socket) => {
        console.log("testmode connection") ;

        socket.on("setTestWords", async (data) =>{
          if(data.mode === "RANDOM"){
            try{
                  questionWords[socket.id] = await testModeModel.setTestWords(data.category, data.chapter, data.questionNumber) ;
                  questionType[socket.id] = await generateQuestionType(data.questionNumber, data.questionType) ;
                  io.to(socket.id).emit("setSucessfully", {questionNumber:data.questionNumber}) ;
              }catch(err){
                  io.to(socket.id).emit("err", {err:err}) ;
                  console.log(err) ;
              }
          }else if(data.mode === "ALL"){ //ALL
            try{
              questionWords[socket.id] = await testModeModel.setTestWords(data.category, data.chapter, 10000) ;
              const questionNumber = questionWords[socket.id].length ;
              console.log(questionNumber) ;
              questionType[socket.id] = await generateQuestionType(questionNumber, data.questionType) ;
              io.to(socket.id).emit("setSucessfully", {questionNumber:questionNumber}) ;
            }catch(err){
              io.to(socket.id).emit("err", {err:err}) ;
              console.log(err) ;
            }
          }else{ /// top-N
            try{
              const decode =  jwt.verify(data.token, secretKey);
              console.log(decode.id, "top-N") ;
              testModeModel.reRangeProb(decode.id, data.category, data.chapter) ;
              questionWords[socket.id]  = await testModeModel.setTestWordsWithProb(data.category, data.chapter, data.questionNumber, decode.id) ;
              questionWords[socket.id] = await testModeModel.setTestWordsWithProb(data.category, data.chapter, data.questionNumber, decode.id) ;
              
              const questionNumber = questionWords[socket.id].length ;
              questionType[socket.id] = await generateQuestionType(questionNumber, data.questionType) ;
              io.to(socket.id).emit("setSucessfully", {questionNumber:questionNumber}) ;
            }catch(err){
              io.to(socket.id).emit("err", {err:err}) ;
              console.log(err) ;
            }

          }
        }) ;

        socket.on("getTestWords", async(data) => {
            const index = data.index ;
            if(questionType[socket.id][index] === "EtoC"){
              console.log(questionWords[socket.id][index],"fix no see") ;
                io.to(socket.id).emit("getTestWords", {wordid:questionWords[socket.id][index].id, word:questionWords[socket.id][index].english, abbreviation:questionWords[socket.id][index].abbreviation, index:index}) ;
            }else{
                const question = questionWords[socket.id][index].chinese.split('；');
                const randomIndex = Math.floor(Math.random() * (question.length));
                io.to(socket.id).emit('getTestWords', {wordid:questionWords[socket.id][index].id, word:question[randomIndex], abbreviation:questionWords[socket.id][index].abbreviation, index:index}) ;
            }
        }) ;

        socket.on('sendTestAnswer', async (data) => {
            const index = data.index ;
            console.log("sendAnswer", data) ;
            const decode =  jwt.verify(data.token, secretKey);
            const userid = decode.id ;
            console.log("sendAnswer", userid) ;
            if(questionType[socket.id][index] === "EtoC"){
              const answer = questionWords[socket.id][index].chinese.split('；');
              if (answer.includes(data.answer)){         
                io.to(socket.id).emit('testAnswerResponse', {answer:true, word:"Correct !", index:index}) ;
                await testModeModel.adjustProb(userid, data.wordid, 0) ;
              }else{
                io.to(socket.id).emit('testAnswerResponse', {answer:false, word:questionWords[socket.id][index].chinese, index:index}) ;
                questionWords[socket.id].push(questionWords[socket.id][index]) ;
                questionType[socket.id].push(questionType[socket.id][index]) ;
                await testModeModel.adjustProb(userid, data.wordid, 1) ;
              }
            }else{
              if ( data.answer === questionWords[socket.id][index].english){         
                io.to(socket.id).emit('testAnswerResponse', {answer:true, word:"Correct !", index:index}) ;
                await testModeModel.adjustProb(userid, data.wordid, 0) ;
              }else{
                io.to(socket.id).emit('testAnswerResponse', {answer:false, word:questionWords[socket.id][index].english, index:index}) ;
                questionWords[socket.id].push(questionWords[socket.id][index]) ;
                questionType[socket.id].push(questionType[socket.id][index]) ;
                await testModeModel.adjustProb(userid, data.wordid, 1) ;
              }
            }
              
          }) ;

          socket.on("deleteTestRecord", (data) => {
            if(socket.id in questionWords){
              delete questionWords[socket.id] ;
            }
            if(socket.id in questionType){
              delete questionType[socket.id] ;
            }
            const decode =  jwt.verify(data.token, secretKey);
            console.log(decode.id, "delete") ; 
            testModeModel.reRangeProb(decode.id, data.category, data.chapter) ;
          }) ;

          socket.on('disconnect', () => {
            console.log('testMode disconnection');
          });
    }) ; 
} ;




module.exports = {handleTestModeSocket} ;

