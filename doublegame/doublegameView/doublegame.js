const socket = io('http://localhost');

let  roomName;
let countdown ;
let currentEvent ;
let answerNumber = 0 ;
const input = document.getElementById('wordsinput') ;
const yourScore = document.getElementById('yourScore') ;
const myScore = document.getElementById('myScore') ;
const startMatchPage = document.getElementById('startMatchPage') ;
const gamePage = document.getElementById('gamePage');
const endPage = document.getElementById('endPage') ;
const myScorePlace = document.getElementById('myScorePlace') ;
const yourScorePlace = document.getElementById('yourScorePlace') ;
const waitingBlock = document.getElementById('waitingBlock') ;
const result = document.getElementById('result') ;
const wordPlace = document.getElementById('wordsdisplay') ;
const time = document.getElementById("time") ;
const startMatchButton = document.getElementById("startMatchButton") ;
const cancelMatchButton = document.getElementById('cancelMatch') ;
const delay = (ms) => {return new Promise((resolve) => setTimeout(resolve, ms))};

const matching = () => {
    console.log('wait for matching') ; 
    socket.emit('match') ;
    waitingBlock.style.display = 'block';
    startMatchButton.style.display = 'none' ;
    cancelMatchButton.style.display = 'block' ;
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

const wordsIteration = async() => {
    const array = [0, 1] ;
    for (let i of array) {
        await new Promise((resolve, reject) => {
            socket.emit("getWords", { roomName: roomName, index: i });
            socket.once('getWords', async (data) => {
                await getWordsHandle(data) ;
                resolve() ;
            }) ;
        })
    }
    goToEnd() ;
}

const getWordsHandle = async (data) => {
    answerNumber = 0 ;
    const roomName = data.roomName ;
    const index = data.index ;
    wordPlace.textContent  = data.word ;
    input.disabled = false ;
    input.focus();
    await countdownAndReply(roomName, index) ;
} ;

/** time counting function */
const countdownAndReply = (roomName, index) => {
    return new Promise((resolve) => {
        countdown = 11;
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

        const countdownTimer = setInterval(() => {
            countdown--;
            if(answerNumber === 2){
                countdown = 0 ;
                answerNumber = 0 ;
            }else if (countdown === 0) {
                input.disabled = true ;
                time.textContent = time.textContent ;
            }else if(countdown <= -4){
                countdown = 10 ;
                clearInterval(countdownTimer);  
                resolve() ;
            }else if(countdown > 0){
                time.textContent = countdown ;
            }
        }, 1000) ;
    })
} ;

const goToEnd = () => {
    myScorePlace.textContent = myScore.textContent ;
    yourScorePlace.textContent = yourScore.textContent ;
    startMatchPage.style.display = 'none' ;
    gamePage.style.display = 'none' ;
    endPage.style.display = 'block' ;
    const myfinal = parseInt(myScore.textContent, 10);
    const yourfinal = parseInt(yourScore.textContent, 10);
    if(myfinal >  yourfinal){
        result.textContent = "I win" ;
    }else if(myfinal ===  yourfinal){
        result.textContent = "Draw" ;
    }else{
        result.textContent = "I lose" ;
    }
}

/** time enter to send message function */
const handleEnterKey = (event, roomName, index) => {
    if(event.keyCode === 13){
        const inputValue = input.value ;
        input.value = "" ;
        input.disabled = true ;
        socket.emit("sendAnswer", {answer: inputValue, roomName : roomName, index:index, score:countdown*10}) ;
        console.log('remove event listener') ;
        input.removeEventListener('keydown', currentEvent);
    }
} ;

socket.on('answerResponse', (data) => {
    answerNumber += 1 ;
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

const backMain = () => {
    window.location.href = 'main.html';
} ;

const backStartMatch = () => {
    gamePage.style.display = 'none' ;
    endPage.style.display = 'none' ;
    startMatchPage.style.display = 'block' ;
    myScore.textContent = "0" ;
    yourScore.textContent = "0" ;
    socket.emit('match') ;
} ;

const cancelMatch = () => {
    socket.emit("cancelMatch") ;
}

socket.on("cancelMatch", () => {
    cancelMatchButton.style.display = "none" ;
    waitingBlock.style.display = 'none' ;
    startMatchButton.style.display = 'block' ;
})