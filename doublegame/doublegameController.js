const doubleGameModel = require('./doublegameModel') ;

const questionNumber = 2 ;

const handleSocketEvents = (io) => {
    const waitingUsers = [] ;
    const english = ['apple', 'banana'] ;
    const chinese = ["蘋果", "香蕉"] ;
    const roomWords = {} ;
    const roomQuestionType = {} ;
    io.on('connection', (socket) => {
      console.log('user connection');

      const getRandomElement = (questionNumber) => {
        let p ;
        const array = [] ;
        for (let i=0; i<questionNumber; i++){
          p = Math.random();
          if(p < 0.5){
            array.push("EtoC") ;
          }else{
            array.push("CtoE") ;
          }
        }
        return array ;
      }

      socket.on('match', async (data) => {
        console.log(`${socket.id}, server receive match request`);
        waitingUsers.push({id:socket.id, category: data.category, chapter: data.chapter}) ;
        const myIndex = waitingUsers.findIndex(user => user.id === socket.id) ;
        for(let i=0; i<waitingUsers.length - 1; i++){
          if(i != myIndex){
            if(waitingUsers[i].category === data.category && waitingUsers[i].chapter === data.chapter){
              const user1 = waitingUsers[myIndex].id ;
              const user2 = waitingUsers[i].id ;
              try{
                const roomName = `room_${user1}_${user2}` ;
                roomQuestionType[roomName] = getRandomElement(questionNumber) ;
                roomWords[roomName] = await doubleGameModel.getWords(data.category, data.chapter, questionNumber) ;
                console.log("haha", roomWords[roomName]) ;
                console.log("haha", roomQuestionType[roomName]) ;
                io.to(user1).emit('joinRoom', {roomName : roomName}) ;
                io.to(user2).emit('joinRoom', {roomName : roomName}) ;
                waitingUsers.splice(Math.max(i, myIndex), 1) ;
                waitingUsers.splice(Math.min(i, myIndex), 1) ;
                break ;
              }catch(err){
                io.to(user1).emit("err", {err: err}) ;
                io.to(user2).emit("err", {err: err}) ;
                console.log(err) ;
              }
            }
          }
        } 
      });


      socket.on("cancelMatch", () => {
        const index = waitingUsers.findIndex(user => user.id === socket.id) ;
        if(index !== -1) {
          waitingUsers.splice(index, 1) ;
        }else{
          console.log("element not found") ;
        }
        io.to(socket.id).emit("cancelMatch") ;
      })
  
      socket.on('joinRoom', (data) => {
        const roomName = data.roomName ;
        socket.join(roomName);
        io.to(socket.id).emit("matchSucessfully", {roomName : roomName}) ;
      });

      socket.on('disconnect', () => {
        console.log('user disconnection');
        const index = waitingUsers.findIndex(user => user.id === socket.id) ;
        waitingUsers.splice(index, 1) ;
      });
  
      socket.on('getWords', async (data) => {
        const roomName = data.roomName ;
        const index = data.index ;
        if(roomQuestionType[roomName][index] === "EtoC"){
          io.to(socket.id).emit('getWords', {word:roomWords[roomName][index].english, roomName: roomName, index:index}) ;
        }else{
          const question = roomWords[roomName][index].chinese.split('；');
          const randomIndex = Math.floor(Math.random() * (question.length));
          io.to(socket.id).emit('getWords', {word:question[randomIndex], roomName: roomName, index:index}) ;
        }
      }) ;

      socket.on('sendAnswer', async (data) => {
        const roomName = data.roomName ;
        const index = data.index ;
        const score = data.score ;
        console.log(`${socket.id} send answer ${data.answer}`) ;
        if(roomQuestionType[roomName][index] === "EtoC"){
          const answer = roomWords[roomName][index].chinese.split('；');
          if (answer.includes(data.answer)){         
            io.to(data.roomName).emit('answerResponse', {answer:true, id: socket.id, score:score}) ;
          }else{
            io.to(data.roomName).emit('answerResponse', {answer:false, id: socket.id}) ;
          }
        }else{
          if ( data.answer === roomWords[roomName][index].english){         
            io.to(data.roomName).emit('answerResponse', {answer:true, id: socket.id, score:score}) ;
          }else{
            io.to(data.roomName).emit('answerResponse', {answer:false, id: socket.id}) ;
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
  
  module.exports = {handleSocketEvents, getChapter};