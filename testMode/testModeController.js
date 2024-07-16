const testModeModel = require('./testModeModel') ;
// const jwt = require('jsonwebtoken');
// const learningRate = process.env.LEARNING_RATE;
const cookie = require('cookie') ;
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const secretKey = process.env.JWT_SECRETKEY;


const answered = {} ;
const roomQuestion = {} ;
const roomAnswer = {} ;
const roomAbbrev = {} ;
const roomQuestionType = {} ;
const rooms = {} ;


const generateQuestionType = async (type) => {
    
    if(type==="CtoE") return "CtoE" ;
    else if(type==="EtoC") return "EtoC" ;
    else{
      return Math.random()<0.5 ? "EtoC" : "CtoE" ;
    }
}

const handleTestModeSocket = (io) => {
    const testModeio = io.of('/testmode');
    testModeio.on('connection', (socket) => {
        console.log("testmode connection") ;

        socket.on('match', async ({category, chapter, type, mode, token}) => {
          try{
            roomName =  uuidv4() ;
            const q = [] ;
            const a = [] ;
            const abbrev = [] ;
            const qtype = [] ;

            let questionNumber ;
            if(mode==="RANDOM") questionNumber = 20 ;
            else questionNumber = 9999 ;
            const words = await testModeModel.setTestWords(
              category, 
              chapter, 
              questionNumber
            ) ;     
            for(let index=0; index<words.length; index++){
              let p = await generateQuestionType(type) ;

              if(p === "EtoC") {
                
                q.push(words[index].english) ;
                a.push({ans:words[index].chinese, count:1}) ;
              }else{
                a.push({ans:words[index].english, count:1}) ;
                q.push(words[index].chinese) ;
              }
              qtype.push(p) ;
              abbrev.push(words[index].abbreviation) ;
            }
            roomQuestion[roomName] = q ;
            roomAnswer[roomName] = a ;
            roomAbbrev[roomName] = abbrev ; 
            rooms[roomName] = {players:{}, timer: null} ; 
            answered[roomName] = false ;
            roomQuestionType[roomName] = qtype ;
            testModeio.to(socket.id).emit('inviteRoom', {roomName : roomName}) ;
          }catch(err){
            testModeio.to(socket.id).emit("err", {err: err}) ;
   
          }              
        });

        socket.on("joinRoom", async ({roomName}) => { //data => socketId:socket.id, roomName:roomName, 
          rooms[roomName].players[socket.id.toString()] = {
          socketId: socket.id, 
          score: 0
          } ;
          rooms[roomName].questionNumber = roomQuestion[roomName].length ;
          socket.join(roomName) ;
          testModeio.to(socket.id).emit("successfully join",{roomName:roomName}) ;

        }) ;

        socket.on("ready",({roomName}) => {  //data => roomName:roomName
            startIteration(testModeio, roomName, socket.id) ;
        }) ;

        socket.on("submitAnswer", ({input, roomName}) => { //input:input, socketId :socketId, roomName:roomName
          try{
            const room = rooms[roomName] ;
            answered[roomName] = true ;
            const ansDict = roomAnswer[roomName][0] ;
            const ans = ansDict.ans.split('；') ;
            const count = ansDict.count ;
            let result ;
            if(ans.includes(input.toLowerCase())){ 
              result = true ;
              if(count===1) room.players[socket.id].score += 100/rooms[roomName].questionNumber ;
              else if(count===2) room.players[socket.id].score += 50/rooms[roomName].questionNumber ;
              else room.players[socket.id].score += 10/rooms[roomName].questionNumber ;
            }
            else {
              result = false ;
              if(roomAnswer[roomName][0].count<3){
                roomQuestion[roomName].push(roomQuestion[roomName][0]) ;
                roomAnswer[roomName].push({ans:roomAnswer[roomName][0].ans, count:roomAnswer[roomName][0].count+1}) ;
                roomAbbrev[roomName].push(roomAbbrev[roomName][0]) ;
                roomQuestionType[roomName].push(roomQuestionType[roomName][0]) ;
              }
            }

            const question = roomQuestion[roomName].shift() ;
            const answer = roomAnswer[roomName].shift() ;
            roomAbbrev[roomName].shift() ;
            roomQuestionType[roomName].shift() ;

            testModeio.to(roomName).emit("answerResult", {
              result:result, 
              answer:answer.ans, 
              score:room.players[socket.id].score
            }) ;
            endGame(testModeio, roomName, question, answer.ans) ;
          }catch(error){
            testModeio.to(socket.id).emit("error") ;
          }
        })

        socket.on("discon", ({roomName}) => {
          deleteData(roomName) ;
          socket.disconnect() ;
        })

        socket.on("disconnect",()=>{

        })
    }) ; 
} ;

const endGame  = (testModeio, roomName, question, answer) => {

  try{
    testModeio.to(roomName).emit("endGame", {
      question:question,
      answer:answer 
    }) 
  }catch(err){
    console.log(err, "老問題 from endgame") ;
    testModeio.to(roomName).emit("error");
  }
}

const startIteration = async (testModeio, roomName, socketId) => {
  
  while(roomQuestion[roomName] && roomQuestion[roomName].length !== 0) {
    await startGame(testModeio, roomName) ;
    await new Promise((resolve)=>{setTimeout(()=>{resolve()}, 2000)}) ;
  }
  endIteration(testModeio, roomName, socketId) ;
}

const startGame = (testModeio, roomName) => {
  return new Promise((resolve, reject) => {
    try {
      answered[roomName] = false;
      const room = rooms[roomName];
      if (!roomQuestion[roomName]) {
        throw new Error(`roomQuestion[${roomName}] is undefined`);
      }

      let remainTime = 9;

      const interval = setInterval(() => {
        remainTime--;

        testModeio.to(roomName).emit("timer", { timing: remainTime, roomName: roomName });
        if (remainTime < -2 || answered[roomName]) {
          clearInterval(interval);
          resolve(); 
        }
      }, 1000);

      testModeio.to(roomName).emit('startGame', {
        word: roomQuestion[roomName][0],
        abbreviation: roomAbbrev[roomName][0],
        roomName: roomName
      });

    } catch (error) {
      testModeio.to(roomName).emit("error");
      reject(error); 
    }
  });
}

const deleteData = (roomName) => {
  if(roomName in roomQuestion) delete roomQuestion[roomName] ;
  if(roomName in roomAnswer) delete roomAnswer[roomName] ;
  if(roomName in roomAbbrev) delete roomAbbrev[roomName] ;
  if(roomName in rooms) delete rooms[roomName] ;
  if(roomName in roomQuestionType) delete roomQuestionType[roomName] ;
  if(roomName in answered) delete answered[roomName] ;
}

const endIteration = (testModeio, roomName, socketId) => {
  const room = rooms[roomName] ;
  if(room) testModeio.to(roomName).emit("final", {score: room.players[socketId].score}) ;
  deleteData(roomName) ;
}

module.exports = {handleTestModeSocket} ;

