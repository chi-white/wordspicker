const doubleGameModel = require('./doublegameModel') ;

const questionNumber = 2 ;

const getRandomElement = (questionNumber) => {
  const array = [] ;
  let p ;
  for(let i=0; i<questionNumber; i++){
    p = Math.random() ;
    if(p<0.5) array.push("EtoC") ;
    else array.push("CtoE") ;
  }
  return array ;
}

const findPair = (waitingUsers, data, id) => {
  for(let key in waitingUsers){
    console.log( waitingUsers[key], data.chapter, waitingUsers) ;
    if(key !== id && waitingUsers[key].category === data.category && waitingUsers[key].chapter === data.chapter)
      return key ;
  }
  return null ;
} 


const handleDoublegameSocket = (io) => {
    const waitingUsers = {} ;
    const roomWords = {} ;
    const roomQuestionType = {} ;
    io.on('connection', (socket) => {
      console.log('doublegame connection');

      socket.on('match', async (data) => {
        console.log(`${socket.id}, server receive match request`);
        waitingUsers[socket.id] = {category:data.category, chapter: data.chapter} ;
        console.log("curr", socket.id, data.category, data.chapter) ;
        const pairId = findPair(waitingUsers, data, socket.id) ;
          try{
            if(pairId !== null){
              delete waitingUsers[pairId] ;
              delete waitingUsers[socket.id] ;
              const roomName =  '${socket.id}${pairId}' ;
              roomQuestionType[roomName] = getRandomElement(questionNumber) ;
              roomWords[roomName] = await doubleGameModel.getWords(data.category, data.chapter, questionNumber) ;
              io.to(pairId).emit('joinRoom', {roomName : roomName}) ;
              io.to(socket.id).emit('joinRoom', {roomName : roomName}) ;
            }
          }catch(err){
            io.to(pairId).emit("err", {err: err}) ;
            io.to(socket.id).emit("err", {err: err}) ;
            console.log(err) ;
          }
      });


      socket.on("cancelMatch", () => {
        console.log(`${socket.id} cancels match`) ;
        try{
          delete waitingUsers[socket.id] ;
          io.to(socket.id).emit("cancelMatch") ;
        }catch(err){
          console.log(`${socket.id} cancel fail`) ;
        }
      })
  
      socket.on('joinRoom', (data) => {
        const roomName = data.roomName ;
        socket.join(roomName);
        io.to(socket.id).emit("matchSucessfully", {roomName : roomName}) ;
      });

      socket.on('disconnect', () => {
        console.log('doublegame disconnection');
        delete waitingUsers[socket.id] ;
      });
  
      socket.on('getWords', async (data) => {
        const roomName = data.roomName ;
        const index = data.index ;
        if(roomQuestionType[roomName][index] === "EtoC"){
          io.to(socket.id).emit('getWords', {word:roomWords[roomName][index].english, 
            abbreviation:roomWords[roomName][index].abbreviation , 
            roomName: roomName, 
            index:index
          }) ;
        }else{
          const question = roomWords[roomName][index].chinese.split('；');
          const randomIndex = Math.floor(Math.random() * (question.length));
          io.to(socket.id).emit('getWords', {word:question[randomIndex], 
            abbreviation:roomWords[roomName][index].abbreviation, 
            roomName: roomName, 
            index:index
          }) ;
        }
      }) ;

      socket.on('sendAnswer', async (data) => {
        const roomName = data.roomName ;
        const index = data.index ;
        const score = data.score ;
        if(roomQuestionType[roomName][index] === "EtoC"){
          const answer = roomWords[roomName][index].chinese.split('；');
          if (answer.includes(data.answere.toLowerCase())){         
            io.to(data.roomName).emit('answerResponse', {answer:true, id: socket.id, score:score}) ;
          }else{
            io.to(data.roomName).emit('answerResponse', {answer:false, id: socket.id, word:roomWords[roomName][index].chinese}) ;
          }
        }else{
          if ( data.answer === roomWords[roomName][index].english){         
            io.to(data.roomName).emit('answerResponse', {answer:true, id: socket.id, score:score}) ;
          }else{
            io.to(data.roomName).emit('answerResponse', {answer:false, id: socket.id, word:roomWords[roomName][index].english}) ;
          }
        }
          
      }) ;

      socket.on("deleteRecord", (data) => {
        const roomName = data.roomName ;
        if(roomName in roomWords){
          delete roomWords[roomName] ;
        }
        if(roomName in roomQuestionType){
          delete roomQuestionType[roomName] ;
        }
      }) ;
    });
  } ;

const getChapter = async(req, res) => {
  try {
    const category = req.query.category;
    const result = await doubleGameModel.getChapter(category) ;
    return res.status(200).json({data:result}) ;
  }catch(err){
    console.log("getChapter fail") ;
    return res.status(500).json({err:err})
  }
}
  
  module.exports = {handleDoublegameSocket, getChapter};