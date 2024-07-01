const {host} = require('../../host') ;

const socket = io(host);

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
const myBar = document.getElementById("myBar") ;
const yourBar = document.getElementById("yourBar") ;
const myinfo = document.getElementById('gamePage-myinfo');
const yourinfo = document.getElementById('gamePage-yourinfo');
const correct_ans = document.getElementById("correct-ans") ;
var sendAns = false ;

const matching = () => {
    if(categorySelect.value === "" || chapterSelect.value === ""){
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please choose category and chapter!',
        });
    }else{
        console.log('wait for matching') ; 
        socket.emit('match', {category: categorySelect.value, chapter: chapterSelect.value}) ;
        startMatchPage.style.display = "none" ;
        waitingPage.style.display = "flex" ;
    }
}

socket.on("joinRoom", (data)=>{
    socket.emit("joinRoom", {roomName : data.roomName}) ;
}) ;

socket.on("matchSucessfully", async (data) => {
    roomName = data.roomName ;
    waitingPage.style.display = 'none' ;
    gamePage.style.display = "flex" ;
    wordsIteration() ;
}) ;

const wordsIteration = async() => {
    const array = Array.from({ length: questionNumber}, (_, i) => i);
    for (let i of array) {
        await new Promise((resolve, reject) => {
            socket.emit("getWords", { roomName: roomName, index: i });
            socket.once('getWords', async (data) => {
                correct_ans.textContent = "" ;
                sendAns = false ;
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
    wordPlace.textContent  = data.word+` (${data.abbreviation}.)`;
    input.disabled = false ;
    input.focus();
    await countdownAndReply(roomName, index) ;
} ;

/** time counting function */
const countdownAndReply = (roomName, index) => {
    return new Promise((resolve) => {
        countdown = 12;
        /**consequence is important: 
        1. firstly remove existed listener
        2. defind new one
        3. execute new one
        if change the consequence, old one would never be deleted
    */
        if(currentEvent){
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
                const inputValue = input.value ;
                
                input.disabled = true ;
                time.textContent = time.textContent ;
                if(!sendAns){
                    console.log("send answer when time = 0") ;
                    socket.emit("sendAnswer", {answer: inputValue, roomName : roomName, index:index, score:countdown*10}) ;
                }
            }else if(countdown <= -4){
                countdown = 12 ;
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
    myScorePlace.textContent = myScore.getAttribute("value") ;
    yourScorePlace.textContent = yourScore.getAttribute("value") ;
    gamePage.style.display = 'none' ;
    endPage.style.display = 'flex' ;
    const myfinal = parseInt(myScore.getAttribute("value"));
    const yourfinal = parseInt(yourScore.getAttribute("value"));
    if(myfinal >  yourfinal){
        result.textContent = "Win" ;
    }else if(myfinal ===  yourfinal){
        result.textContent = "Draw" ;
    }else{
        result.textContent = "Lose" ;
    }
    myBar.style.height = "0" ;
    yourBar.style.height = "0" ;
    myScore.setAttribute("value", "0") ;
    yourScore.setAttribute("value", "0") ;
    myScore.textContent = myScore.getAttribute("value") ;
    yourScore.textContent = yourScore.getAttribute("value") ;
    correct_ans.textContent = "" ;
}

const handleEnterKey = (event, roomName, index) => {
    if(event.keyCode === 13){
        const inputValue = input.value ;
        input.value = "" ;
        input.disabled = true ;
        socket.emit("sendAnswer", {answer: inputValue, roomName : roomName, index:index, score:countdown*10}) ;
        sendAns = true ;
        input.removeEventListener('keydown', currentEvent);
    }
} ;


const triggerFloat = (element) => {
    element.classList.add('float-up');
    element.addEventListener('animationend', () => {
        element.classList.remove('float-up');
    });
} ;

socket.on('answerResponse', (data) => {
    answerNumber += 1 ;
    if(data.id === socket.id){ 
        if(data.answer === true){
            // console.log(`${data.id} wins point`) ;
            const score = data.score ;
            const initScore = parseInt(myScore.getAttribute("value")) ;
            myScore.setAttribute("value", (initScore + score).toString()) ;
            myScore.textContent = myScore.getAttribute("value") ;
            const fullScore = 100*questionNumber*0.7 ;
            const barProgress = ((myScore.getAttribute("value")/fullScore)*100).toString() ;
            myBar.style.height = barProgress+"%" ;
            myinfo.textContent = "Correct ! " ;
            triggerFloat(myinfo) ;

        }else{
            // console.log(`${data.id} losses point`) ;
            myinfo.textContent = "Wrong" ;
            triggerFloat(myinfo) ;
            correct_ans.textContent = data.word ;
        }
    }else{
        if(data.answer === true){
            // console.log(`${data.id} wins point`) ;
            const score = data.score ;
            const initScore = parseInt(yourScore.getAttribute("value"), 10) ;
            yourScore.setAttribute("value", (initScore + score).toString()) ;
            yourScore.textContent = yourScore.getAttribute("value") ;
            const fullScore = 100*questionNumber*0.7 ;
            const barProgress = ((yourScore.getAttribute("value")/fullScore)*100).toString() ;
            yourBar.style.height = barProgress+"%" ;
            yourinfo.textContent = "Correct ! " ;
            triggerFloat(yourinfo) ;
        }else{
            // console.log(`${data.id} losses point`) ;
            yourinfo.textContent = "Wrong" ;
            console.log("rival error") ;
            triggerFloat(yourinfo) ;
        }
    }
}) ;

const backMain = () => {
    window.location.href = 'main.html';
} ;

const backWaiting = () => {
    endPage.style.display = 'none' ;
    waitingPage.style.display = 'flex' ;
    socket.emit('match', {category: categorySelect.value, chapter: chapterSelect.value}) ;
} ;

const backStartMatch = () => {
    endPage.style.display = 'none' ;
    startMatchPage.style.display = 'flex' ;
}

const cancelMatch = () => {
    socket.emit("cancelMatch") ;
}

socket.on("cancelMatch", () => {
    waitingPage.style.display = "none" ;
    startMatchPage.style.display = "flex" ;
}) ;

const updateCategory = async() => {
    chapterSelect.innerHTML = "" ;
    if (categorySelect.value === ""){
        chapterSelect.disabled = true ;

    }else{
        chapterSelect.disabled = false ;
        const url = host+`/getChapter?category=${categorySelect.value}` ;
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

const logout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "user.html"; 
} ;

const back = () => {
    if(startMatchPage.style.display == "none"){
        startMatchPage.style.display = "flex" ;
        waitingPage.style.display = "none" ;
        gamePage.style.display = "none" ;
        endPage.style.display = "none" ;
    }else{
        window.location.href = "main.html"; 
    }
} ;

const home = () => {
    window.location.href = "main.html"; 
}





