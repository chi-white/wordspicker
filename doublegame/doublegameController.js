const doubleGameModel = require('./doublegameModel') ;
const { v4: uuidv4 } = require('uuid');

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
    if(key !== id &&
       waitingUsers[key].category === data.category && 
       waitingUsers[key].chapter === data.chapter)
      return key ;
  }
  
  return null ;
} 

const waitingUsers = {} ;
const roomQuestion = {} ;
const roomAnswer = {} ;
const roomAbbrev = {} ;
const roomQuestionType = {} ;
const rooms = {} ;
const doubleAnscheck = {} ;

const handleDoublegameSocket = (io) => {
    const dgio = io.of('/doublegame');
    dgio.on('connection', (socket) => {
      console.log('doublegame connection');

      socket.on('match', async (data) => {
        waitingUsers[socket.id] = {category:data.category, chapter: data.chapter} ;
        const pairId = findPair(waitingUsers, data, socket.id) ;
          try{
            if(pairId){
              delete waitingUsers[pairId] ;
              delete waitingUsers[socket.id] ;
              const roomName =  uuidv4() ;
              
              let q = [] ;
              let a = [] ;
              let abbrev = [] ;
              const words = await doubleGameModel.getWords(
                data.category, 
                data.chapter, 
                9999
              ) ;
              roomQuestionType[roomName] = getRandomElement(words.length) ;
              for(let index=0; index<words.length; index++){
                if(roomQuestionType[roomName][index] == "EtoC") {
                  q.push(words[index].english) ;
                  a.push(words[index].chinese) ;
                }else{
                  a.push(words[index].english) ;
                  q.push(words[index].chinese) ;
                }
                abbrev.push(words[index].abbreviation) ;
              }
              roomQuestion[roomName] = q ;
              roomAnswer[roomName] = a ;
              roomAbbrev[roomName] = abbrev ;
              // rooms[roomName] = {players:{}, timer: null, people:0} ;
              rooms[roomName] = {players:{}, people:0} ;
              doubleAnscheck[roomName] = 0 ;
              dgio.to(pairId).emit('inviteRoom', {roomName : roomName}) ;
              dgio.to(socket.id).emit('inviteRoom', {roomName : roomName}) ;
            }
          }catch(err){
            dgio.to(pairId).emit("err", {err: err}) ;
            dgio.to(socket.id).emit("err", {err: err}) ;
          }
      });

      socket.on("joinRoom", async ({roomName}) => { //data => socketId:socket.id, roomName:roomName, 
          rooms[roomName].players[socket.id.toString()] = {
          socketId: socket.id, 
          score: 0
          } ;
          socket.join(roomName) ;
          dgio.to(socket.id).emit("successfully join",{roomName:roomName}) ;
          console.log("from Join room", rooms[roomName].players) ;
      }) ; //這邊會太快導致後面ready獨到undefined，只有console.log才能解決

      socket.on("ready",({roomName}) => {  //data => roomName:roomName
        rooms[roomName].people += 1 ;

        if( rooms[roomName].people===2){
          startIteration(dgio, roomName) ;
        }
      }) ;

      socket.on("submitAnswer", ({input,roomName, index, time}) => { //input:input, docketId :socketId, roomId:roomId, index : index
          try{
            const room = rooms[roomName] ;
            doubleAnscheck[roomName]++ ;
            const ans = roomAnswer[roomName][index].split('；') ;
            let result ;
          if(ans.includes(input.toLowerCase())){ 
            result = true ;
            room.players[socket.id].score += (10/roomQuestion[roomName].length)*time ;
          }
          else result = false ;
          dgio.to(roomName).emit("answerResult", {
            socketId:socket.id,
            result:result, 
            answer:roomAnswer[roomName][index], 
            score:room.players[socket.id].score
          }) ;
          checkBothAnswered(dgio, roomName, index, input, roomQuestion[roomName][index]) ;
          }catch(error){
            console.log("submit answer wrong", error) ;
            dgio.to(socket.id).emit("error") ;
          }
      })



      socket.on("cancelMatch", () => {
        console.log(`${socket.id} cancels match`) ;
        try{
          delete waitingUsers[socket.id] ;
        }catch(err){
          console.log(`${socket.id} cancel fail`) ;
          dgio.to(socket.id).emit("error") ;
        }
      })
    });
  } ;




const startIteration = async (dgio, roomName) => {
  for(let i=0; i<roomQuestion[roomName].length; i++ ) {
    await startGame(dgio, roomName, i) ;
    await new Promise((resolve)=>{setTimeout(()=>{resolve()}, 3000)}) ;
  }
  endIteration(dgio, roomName) ;
}

const startGame = (dgio, roomName, index) => {
  doubleAnscheck[roomName] = 0 ;
  return new Promise((resolve, reject) => {
    try {
      const room = rooms[roomName];

      if (!roomQuestion[roomName] || !roomQuestion[roomName][index]) {
        throw new Error(`roomQuestion[${roomName}][${index}] is undefined`);
      }

      // room.timer = setTimeout(() => {
      //   endGame(
      //     dgio,
      //     roomName,
      //     index,
      //   );
      //   resolve(); 
      // }, 13000);

      let remainTime = 11;

      const interval = setInterval(() => {
        remainTime--;
        dgio.to(roomName).emit("timer", { timing: remainTime, index:index, roomName:roomName });
        
        if (remainTime < -3||doubleAnscheck[roomName]===2) {
          clearInterval(interval);
          resolve() ;
        }

      }, 1000);

      dgio.to(roomName).emit('startGame', {
        word: roomQuestion[roomName][index],
        abbreviation: roomAbbrev[roomName][index],
        index: index,
        roomName: roomName
      });

    } catch (error) {
      console.log("ahahahahahahahahahahahahahahahahaha") ;
      dgio.to(roomName).emit("error");
      reject(error); 
    }
  });
}


const checkBothAnswered = (dgio, roomName, index, input, question) => {
  if(doubleAnscheck[roomName] && doubleAnscheck[roomName]==2){
    const room = rooms[roomName] ;
    // clearTimeout(room.timer) ;
    endGame(dgio, roomName, index) ;
  }
}

const endGame = (dgio, roomName, index) => {
  try{
    dgio.to(roomName).emit("endGame", {
      question:roomQuestion[roomName][index],
      index:index,
      answer:roomAnswer[roomName][index] 
    }) 
  }catch(err){
    console.log(err, "老問題 from endgame") ;
    dgio.to(roomName).emit("error");
  }
}

const endIteration = (dgio, roomName) => {
  const room = rooms[roomName] ;
  const scores = Object.entries(room.players).map(([socketId, data])=>{return {socketId:socketId, score:data.score}}) ;
  dgio.to(roomName).emit("final", {scores: scores}) ;
  if(roomName in roomQuestion) delete roomQuestion[roomName] ;
  if(roomName in roomAnswer) delete roomAnswer[roomName] ;
  if(roomName in roomAbbrev) delete roomAbbrev[roomName] ;
  if(roomName in rooms) delete rooms[roomName] ;
  if(roomName in roomQuestionType) delete roomQuestionType[roomName] ;
  if(roomName in doubleAnscheck) delete doubleAnscheck[roomName] ; 
}


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