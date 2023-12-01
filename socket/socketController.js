const handleSocketEvents = (io) => {
    const waitingUsers = [] ;
    const english = ['apple', 'banana'] ;
    const chinese = ["蘋果", "香蕉"] ;
    const roomWords = {} ;
    io.on('connection', (socket) => {
      console.log('user connection');

      socket.on('match', () => {
        console.log(`${socket.id}, server receive match request`);
        waitingUsers.push(socket.id) ;
        if(waitingUsers.length >= 2){
          const [user1, user2] = getRandomPair(waitingUsers) ;
          const roomName = `room_${user1}_${user2}` ;
          roomWords[roomName] = [
            {english:english[0], chinese: chinese[0]},
            {english:english[1], chinese: chinese[1]}                     //change to databasse
          ]
          io.to(user1).emit('joinRoom', {roomName : roomName}) ;
          io.to(user2).emit('joinRoom', {roomName : roomName}) ;
          waitingUsers.splice(waitingUsers.indexOf(user1), 1) ;
          waitingUsers.splice(waitingUsers.indexOf(user2), 1) ;
        } 
      });

      /** cancelMatch */
      socket.on("cancelMatch", () => {

      })
  
      socket.on('joinRoom', (data) => {
        const roomName = data.roomName ;
        socket.join(roomName);
        io.to(socket.id).emit("matchSucessfully", {roomName : roomName}) ;
      });

      socket.on('disconnect', () => {
        console.log('user disconnection');
      });
  
      socket.on('getWords', (data) => {
        const roomName = data.roomName ;
        const index = data.index ;
        io.to(socket.id).emit('getWords', {word:roomWords[roomName][index].english, roomName: roomName, index:index}) ; //change to database
      }) ;

      socket.on('sendAnswer', (data) => {
        const roomName = data.roomName ;
        const index = data.index ;
        const score = data.score ;
        if (data.answer === roomWords[roomName][index].chinese){         //change to database
          io.to(data.roomName).emit('answerResponse', {answer:true, id: socket.id, score:score}) ;
        }else{
          io.to(data.roomName).emit('answerResponse', {answer:false, id: socket.id}) ;
        }
      }) ;
    });

    

    const getRandomPair = (array) => {
        const shuffled = array.sort(() => 0.5 - Math.random()); 
        return shuffled.slice(0, 2);
    }
  }
  
  module.exports = handleSocketEvents;