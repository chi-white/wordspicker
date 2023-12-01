const socket = io('http://localhost');

var  roomName;
let countdown ;
let currentEvent ;
const input = document.getElementById('wordsinput') ;
const yourScore = document.getElementById('yourScore') ;
const myScore = document.getElementById('myScore') ;
const startMatchPage = document.getElementById('startMatchPage') ;
const gamePage = document.getElementById('gamePage');
const endPage = document.getElementById('endPage') ;
const myScorePlace = document.getElementById('myScorePlace') ;
const yourScorePlace = document.getElementById('yourScorePlace') ;
const waitingBlock = document.getElementById('waitingBlock') ;

const matching = () => {
    console.log('wait for matching') ; 
    socket.emit('match') ;
    waitingBlock.style.display = 'block';
}

socket.on("joinRoom", (data)=>{
    socket.emit("joinRoom", {roomName : data.roomName}) ;
})

socket.on("matchSucessfully", (data) => {
    roomName = data.roomName ;
    startMatchPage.style.display = "none" ;
    endPage.style.display = 'none' ;
    gamePage.style.display = "block" ;
    wordsIteration() ;
}) ;
const delay = (ms) => {return new Promise((resolve) => setTimeout(resolve, ms))};

const wordsIteration = async() => {
    const array = [0, 1] ;
    for (let i of array) {
        console.log("wordsIterations", i) ;
        socket.emit("getWords", { roomName: roomName, index: i });
        await delay(13000);
    }
    goToEnd() ;
}

const goToEnd = () => {
    myScorePlace.textContent = myScore.textContent ;
    yourScorePlace.textContent = yourScore.textContent ;
    startMatchPage.style.display = 'none' ;
    gamePage.style.display = 'none' ;
    endPage.style.display = 'block' ;
}

/** time enter to send message function */
const handleEnterKey = (event, roomName, index) => {
    if(event.keyCode === 13){
        const inputValue = input.value ;
        input.value = "" ;
        input.disabled = true ;
        console.log("handleRnterKey", index) ;
        socket.emit("sendAnswer", {answer: inputValue, roomName : roomName, index:index, score:countdown*10}) ;
        console.log('remove event listener') ;
        input.removeEventListener('keydown', currentEvent);
    }
} ;

/** time counting function */

const startCountdown = () => {
    countdown = 10;
    const time = document.getElementById("time") ;
    const countdownTimer = setInterval(() => {
        countdown--;
        time.textContent = countdown ;
        if (countdown <= 0) {
            clearInterval(countdownTimer);
            input.disabled = true;
        }
    }, 1000);
} ;

socket.on('getWords', (data) =>{
    const wordPlace = document.getElementById('wordsdisplay') ;
    const roomName = data.roomName ;
    const index = data.index ;
    wordPlace.textContent  = data.word ;
    input.disabled = false ;
    input.focus();
    startCountdown() ;
    console.log("getWords", index) ;

    /**consequence is important: 
      1. firstly remove existed listener
      2. defind new one
      3. execute new one
      if change the consequence, old one would never be deleted
     */
    if(currentEvent){
        console.log('remove event listener') ;
        input.removeEventListener('keydown', currentEvent) ;
    } ;
    currentEvent = (event) => {handleEnterKey(event, roomName, index)};
    input.addEventListener('keydown', currentEvent);
}) ;

socket.on('answerResponse', (data) => {
    if(data.id === socket.id){ 
        if(data.answer === true){
            console.log(`${data.id} wins point`) ;
            const score = data.score ;
            const initScore = parseInt(myScore.textContent, 10) ;
            myScore.textContent = (initScore + score).toString() ;
        }else{
            console.log(`${data.id} losses point`) ;
        }
    }else{
        if(data.answer === true){
            console.log(`${data.id} wins point`) ;
            const score = data.score ;
            const initScore = parseInt(yourScore.textContent, 10) ;
            yourScore.textContent = (initScore + score).toString() ;
        }else{
            console.log(`${data.id} losses point`) ;
        }
    }
}) ;

const backStartMatch = () => {
    gamePage.style.display = 'none' ;
    endPage.style.display = 'none' ;
    startMatchPage.style.display = 'block' ;
    waitingBlock.style.display = "none" ;
    myScore.textContent = "0" ;
    yourScore.textContent = "0" ;
}