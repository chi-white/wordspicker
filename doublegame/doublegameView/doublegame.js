// const {host} = require('../../host.js') ;
const host = 'https://kimery.store' ;

const socket = io(host+"/doublegame");

let  roomName;
let countdown ;
let currentEvent ;
let answerNumber = 0 ;
const questionNumber = 20 ;
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
const tbody = document.getElementById('t');
var connect = false ;
let record = [] ;
let inputContainer = "";
let submit = false ;



const handleEnterKey = (event, roomName, index) => {
    if(event.keyCode === 13){
        const inputValue = input.value ;
        inputContainer = inputValue ;
        input.value = "" ;
        input.disabled = true ;
        submit = true ;
        const t = Number(time.textContent) ;
        console.log("submit") ;
        socket.emit("submitAnswer", {input: inputValue, roomName : roomName, index:index, time:t}) ; ///??
        input.removeEventListener('keydown', currentEvent);
    }
} ;

const getCookie = async () => {
    const allCookies = document.cookie;
    const cookiesArray = allCookies.split(';');
    for (let i of cookiesArray){
        const [name, token] = i.split("=") ;
        if(name.trim() == "token"){
            return token ;
        }
    }
    return null ;
} ;


const resetGamePage = () => {
    myScore.textContent = "0" ;
    yourScore.textContent = "0" ;
    myBar.style.height = "0" ;
    yourBar.style.height = "0" ;
    correct_ans.textContent = "" ;
    time.textContent = " " ;
}



const matching = async() => {
    if(categorySelect.value === "" || chapterSelect.value === ""){
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please choose category and chapter!',
        });
    }else{
        const cook = await getCookie() ;
        if(cook){
            socket.connect() ;
            connect = true ;
            socket.emit('match', {category: categorySelect.value, chapter: chapterSelect.value}) ;
            startMatchPage.style.display = "none" ;
            waitingPage.style.display = "block" ;
            resetGamePage() ;
        }else{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'NO token! Please register or log in!',
            });
        }
        
    }
}


socket.on("inviteRoom", ({roomName})=>{
    socket.emit("joinRoom", {roomName:roomName}) ;
}) ;

socket.on("successfully join", ({roomName})=> {
    waitingPage.style.display = "none" ;
    gamePage.style.display = "block" ;
    socket.emit("ready", {roomName:roomName}) ;
})

socket.on("timer", ({timing, index, roomName})=>{
    console.log(index) ;
    if(timing>=0) time.textContent = timing ;
    if(timing===0)input.disabled = true ;
    if(timing===-1&&submit===false){
        const inputValue = input.value ;
        inputContainer = inputValue ;
        input.value = "" ;
        submit = true ;
        const t = Number(time.textContent) ;
        console.log("submit") ;
        socket.emit("submitAnswer", {input: inputValue, roomName : roomName, index:index, time:t}) ;
    } 
})

socket.on("startGame", ({word, abbreviation, index, roomName}) => {
    input.disabled = false ;
    submit = false ;
    wordPlace.textContent  = word+` (${abbreviation}.)`;
    input.focus();
    correct_ans.textContent = " " ;
    if(currentEvent){
        input.removeEventListener('keydown', currentEvent) ;
    } ;
    currentEvent = (event) => {handleEnterKey(event, roomName, index)};
    input.addEventListener('keydown', currentEvent);
})

socket.on("endGame", ({question, index, answer})=> {
    input.disabled = true ;
    input.value = "" ;   
    let c = false;
    if(answer.split("；").includes(input)) c = true ; 
    const dict = {
        index:index,
        question:question,
        input:inputContainer,
        answer:answer,
        correctness: c
    }
    record.push(dict) ;
    inputContainer = " " ;
})

socket.on("answerResult", ({socketId, result, answer, score}) => {
    console.log("got answer reuslt") ;
    if(socketId==socket.id){// us
        myinfo.textContent = "Correct !" ;
        if(!result) {
            correct_ans.textContent = answer ;
            myinfo.textContent = "Wrong ! " ;
         }
        myScore.textContent = score.toFixed(1).toString() ;
        myBar.style.height = score.toString() + "%" ;
        triggerFloat(myinfo) ;
    }else{ //opponent
        yourinfo.textContent = "Correct !" ;
        if(!result) {
            yourinfo.textContent = "Wrong ! " ;
         }
        yourScore.textContent = score.toFixed(1).toString() ;
        yourBar.style.height = score.toString() + "%" ;
        triggerFloat(yourinfo) ;
    }
})

socket.on('error', ()=>{
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Some Error Occur!',
    });
    resetGamePage() ;
    back() ;

})


socket.on("final", ({scores}) => {
    scores.forEach(info => {
        if (info.socketId === socket.id) myScorePlace.textContent = info.score;
        else yourScorePlace.textContent = info.score;
    });
    if(Number(myScorePlace.textContent)===Number(yourScorePlace.textContent)) result.textContent = "Drew!" ;
    else if(Number(myScorePlace.textContent)>Number(yourScorePlace.textContent)) result.textContent = "Winner!" ;
    else result.textContent = "Defeat! "
    tbody.innerHTML = " " ;
    record.forEach(item => {
        const tr = document.createElement('tr') ;
        tr.innerHTML = `
            <th scope="row">${item.index}</th>
            <td>${item.question}</td>
            <td>${item.input}</td>
            <td>${item.answer}</td>
        `
        tbody.appendChild(tr);
    })
    
    gamePage.style.display = "none" ;
    endPage.style.display = "block" ;
})






const backWaiting = () => {
    endPage.style.display = 'none' ;
    waitingPage.style.display = 'block' ;
    tbody.innerHTML = "" ;
    record = [] ;
    socket.emit('match', {category: categorySelect.value, chapter: chapterSelect.value}) ;
    resetGamePage() ;
} ;


const cancelMatch = () => {
    socket.emit("cancelMatch") ;
    waitingPage.style.display = "none" ;
    startMatchPage.style.display = "block" ;
}

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


const back = () => {
    if(startMatchPage.style.display == "none"){
        startMatchPage.style.display = "block" ;
        waitingPage.style.display = "none" ;
        gamePage.style.display = "none" ;
        endPage.style.display = "none" ;
        tbody.innerHTML = " " ;
        record = [] ;
        connect = false ;
        yourinfo.classList.remove('float-up');
        myinfo.classList.remove('float-up') ;
        cancelMatch() ;
        socket.disconnect();
    }else{
        window.location.href = "main.html"; 
    }
} ;

updateCategory() ;

const triggerFloat = (element) => {
    
    element.classList.add('float-up');
    element.addEventListener('animationend', () => {
        element.classList.remove('float-up');
    });
} ;


