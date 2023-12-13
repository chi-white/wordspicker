const testModeModel = require('./testModeModel') ;


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
            try{
                questionWords[socket.id] = await testModeModel.setTestWords(data.category, data.chapter, data.questionNumber) ;
                questionType[socket.id] = await generateQuestionType(data.questionNumber, data.questionType) ;
                io.to(socket.id).emit("setSucessfully") ;
            }catch(err){
                io.to(socket.id).emit("err", {err:err}) ;
                console.log(err) ;
            }
        }) ;

        socket.on("getTestWords", async(data) => {
            const index = data.index ;
            if(questionType[socket.id][index] === "EtoC"){
                io.to(socket.id).emit("getTestWords", {word:questionWords[socket.id][index].english, abbreviation:questionWords[socket.id][index].abbreviation, index:index}) ;
            }else{
                const question = questionWords[socket.id][index].chinese.split('；');
                const randomIndex = Math.floor(Math.random() * (question.length));
                io.to(socket.id).emit('getTestWords', {word:question[randomIndex], index:index}) ;
            }
        }) ;

        socket.on('sendTestAnswer', async (data) => {
            const index = data.index ;
            if(questionType[socket.id][index] === "EtoC"){
              const answer = questionWords[socket.id][index].chinese.split('；');
              if (answer.includes(data.answer)){         
                io.to(socket.id).emit('testAnswerResponse', {answer:true, word:"Correct !"}) ;
              }else{
                io.to(socket.id).emit('testAnswerResponse', {answer:false, word:questionWords[socket.id][index].chinese}) ;
                questionWords[socket.id].push(questionWords[socket.id][index]) ;
                questionType[socket.id].push(questionType[socket.id][index]) ;
              }
            }else{
              if ( data.answer === questionWords[socket.id][index].english){         
                io.to(socket.id).emit('testAnswerResponse', {answer:true, word:"Correct !"}) ;
              }else{
                io.to(socket.id).emit('testAnswerResponse', {answer:false, word:questionWords[socket.id][index].english}) ;
                questionWords[socket.id].push(questionWords[socket.id][index]) ;
                questionType[socket.id].push(questionType[socket.id][index]) ;
              }
            }
              
          }) ;

          socket.on("deleteTestRecord", () => {
            if(socket.id in questionWords){
              delete questionWords[socket.id] ;
            }
            if(socket.id in questionType){
              delete questionType[socket.id] ;
            }
          }) ;

          socket.on('disconnect', () => {
            console.log('testMode disconnection');
          });
    }) ; 
} ;




module.exports = {handleTestModeSocket} ;

