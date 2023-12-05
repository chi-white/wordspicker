const socket = io('http://localhost');

let  roomName;
let countdown ;
let currentEvent ;
let answerNumber = 0 ;
const questionNumber = 2 ;
const input = document.getElementById('wordsinput') ;
const yourScore = document.getElementById('yourScore') ;
const myScore = document.getElementById('myScore') ;
const startMatchPage = document.getElementById('startMatchPage') ;
const gamePage = document.getElementById('gamePage');
const endPage = document.getElementById('endPage') ;
const waitingPage = document.getElementById("waitingPage") ;
const myScorePlace = document.getElementById('myScorePlace') ;
const yourScorePlace = document.getElementById('yourScorePlace') ;
const result = document.getElementById('result') ;
const wordPlace = document.getElementById('wordsdisplay') ;
const time = document.getElementById("time") ;
const startMatchButton = document.getElementById("startMatchButton") ;
const cancelMatchButton = document.getElementById('cancelMatch') ;
const categorySelect = document.getElementById("category");
const chapterSelect = document.getElementById("chapter");

const matching = () => {
    if(categorySelect.value === "" || chapterSelect.value === ""){
        alert("Please choose category and chapter") ;
    }else{
        console.log('wait for matching') ; 
        socket.emit('match', {category: categorySelect.value, chapter: chapterSelect.value}) ;
        startMatchPage.style.display = "none" ;
        waitingPage.style.display = "block" ;
    }
}

socket.on("joinRoom", (data)=>{
    socket.emit("joinRoom", {roomName : data.roomName}) ;
})

socket.on("matchSucessfully", (data) => {
    roomName = data.roomName ;
    waitingPage.style.display = 'none' ;
    gamePage.style.display = "block" ;
    wordsIteration() ;
}) ;

const wordsIteration = async() => {
    const array = Array.from({ length: questionNumber}, (_, i) => i);
    for (let i of array) {
        await new Promise((resolve, reject) => {
            socket.emit("getWords", { roomName: roomName, index: i });
            socket.once('getWords', async (data) => {
                await getWordsHandle(data) ;
                input.value = "" ;
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
        countdown = 9;
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
                countdown = 9 ;
                clearInterval(countdownTimer);  
                resolve() ;
            }else if(countdown > 0){
                time.textContent = countdown ;
            }
        }, 1000) ;
    })
} ;

const goToEnd = () => {
    socket.emit("deleteRecord", {roomName:roomName}) ;
    myScorePlace.textContent = myScore.textContent ;
    yourScorePlace.textContent = yourScore.textContent ;
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

const backWaiting = () => {
    endPage.style.display = 'none' ;
    waitingPage.style.display = 'block' ;
    myScore.textContent = "0" ;
    yourScore.textContent = "0" ;
    socket.emit('match', {category: categorySelect.value, chapter: chapterSelect.value}) ;
} ;

const backStartMatch = () => {
    endPage.style.display = 'none' ;
    startMatchPage.style.display = 'block' ;
    myScore.textContent = "0" ;
    yourScore.textContent = "0" ;
}

const cancelMatch = () => {
    socket.emit("cancelMatch") ;
}

socket.on("cancelMatch", () => {
    waitingPage.style.display = "none" ;
    startMatchPage.style.display = "block" ;
}) ;

const updateCategory = async() => {
    chapterSelect.innerHTML = "" ;
    if (categorySelect.value === ""){
        chapterSelect.disabled = true ;

    }else{
        chapterSelect.disabled = false ;
        const url = `http://localhost/getChapter?category=${categorySelect.value}` ;
        const response = await fetch(url, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        });
        const responseFrame = await response.json() ;
        const responseData = responseFrame.data ;
        for (var i = 0; i < responseData.length; i++) {
            var option = document.createElement("option");
            option.value = responseData[i].chapter;
            option.text = responseData[i].chapter;
            chapterSelect.add(option);
        }
    }
}
socket.on('err', (err) => {
    console.log(err.err) ;
}) ;


