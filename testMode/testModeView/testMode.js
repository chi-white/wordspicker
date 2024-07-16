// const {host} = require('../../host') ;
const host = 'https://kimery.store' ;
let socket = io(host+"/testmode");
let currentEvent ;
let answerNumber = 0;
const categorySelect = document.getElementById("category");
const chapterSelect = document.getElementById("chapter");
const questionTypeSelect = document.getElementById("questionType");
const modeSelect = document.getElementById("mode") ;
const selectPage = document.getElementById("selectPage");
const testPage = document.getElementById("testPage");
const endPage = document.getElementById("endPage");
const input = document.getElementById('wordsinput') ;
const wordPlace = document.getElementById('wordsdisplay') ;
const time = document.getElementById("time") ;
const correct = document.getElementById("correct") ;
const revise = document.getElementById("revise") ;
const finalScoreShow = document.getElementById("finalScore") ;
const tbody = document.getElementById('t');
const questionType = [] ;
var questionNumber = 2 ;
var sendAns = false ;
var initQuestionNumber = questionNumber;
var connect = false ;
let record = [] ;
let index = 0 ;
let inputContainer = "";
let ROOMNAME ;

const handleEnterKey = (event, roomName) => {
    if(event.keyCode === 13){
        const inputValue = input.value ;
        inputContainer = inputValue ;
        input.value = "" ;
        input.disabled = true ;
        socket.emit("submitAnswer", {input: inputValue, roomName : roomName}) ;
        input.removeEventListener('keydown', currentEvent);
    }
} ;

const updateCategory = async() => {
    chapterSelect.innerHTML = "" ;
    if (categorySelect.value === ""){
        chapterSelect.disabled = true ;
    }else{
        chapterSelect.disabled = false ;
        const url = `${host}/getChapter?category=${categorySelect.value}` ;
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

const resetTestPage = () => {

    revise.textContent = "" ;
    time.textContent = " " ;
    wordPlace.textContent = "" ;
}


const questionRequest = async () => {
    if (categorySelect.value === "" || chapterSelect.value === ""){
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

            socket.emit("match", {
                category : categorySelect.value,
                chapter : chapterSelect.value,
                type : questionTypeSelect.value,
                mode : modeSelect.value,
                token:cook
            }) ;
        }else{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'NO token! Please register or log in!',
            });
        }
    } ;
}

socket.on("inviteRoom", ({roomName})=>{
    ROOMNAME = roomName ;
    socket.emit("joinRoom", {roomName:roomName}) ;
}) ;

socket.on("successfully join", async({roomName})=> {
    selectPage.style.display = "none" ;
    document.getElementById("navbar").style.display = "none" ;
    await new Promise(resolve => {
        let countdown = 4;
        const delay = setInterval(() => {
            countdown--;
            document.getElementById("loadingIndicator").style.display = "block" ;
            document.getElementById("loadingIndicator").textContent = countdown ;
            
            if (countdown === 0) {
                clearInterval(delay);
                resolve(); 
            }
        }, 1000);
    });
    document.getElementById("loadingIndicator").style.display = "none" ;

    testPage.style.display = "block" ;
    socket.emit("ready", {roomName:roomName}) ;
})

socket.on("startGame", ({word, abbreviation, roomName}) => {
    input.disabled = false ;
    wordPlace.textContent  = word+` (${abbreviation}.)`;
    input.focus();
    revise.textContent = " " ;
    if(currentEvent){
        input.removeEventListener('keydown', currentEvent) ;
    } ;
    currentEvent = (event) => {handleEnterKey(event, roomName)};
    input.addEventListener('keydown', currentEvent);
})

socket.on("timer", ({timing, roomName})=>{
    if(timing>=0) time.textContent = timing ;
    if(timing===0) input.disabled = true ;
    if(timing===-1) {
        const inputValue = input.value ;
        inputContainer = inputValue ;
        input.value = "" ;
        socket.emit("submitAnswer", {input: inputValue, roomName : roomName}) ;
    }
})

socket.on("endGame", ({question, answer})=> {
    input.disabled = true ;
    input.value = "" ;   
    let c = false;
    index++ ;
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


socket.on("answerResult", ({result, answer, score}) => {

    if(!result) {
        revise.textContent = answer ;
    }else{
        triggerFloat(correct) ;
    }
})

socket.on('error', ()=>{
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Some Error Occur!',
    });
    resetTestPage() ;
    back() ;

})


socket.on("final", ({score}) => {
    document.getElementById("navbar").style.display = "block" ;
    finalScoreShow.textContent = Math.round(score) ;
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
    
    testPage.style.display = "none" ;
    endPage.style.display = "block" ;
})


const backTest = async() => {
    endPage.style.display = 'none' ;
    testPage.style.display = 'block' ;
    resetTestPage() ;
    tbody.innerHTML = "" ;
    record = [] ;
    correct.classList.remove("float-up") ;
    index = 0 ;
    questionRequest() ;
    
}  ;

const deleteSign = () => {
    socket.emit("discon", {roomName:ROOMNAME}) ;
}

const back = () => {
    if(selectPage.style.display == "none"){
        selectPage.style.display = "block" ;
        testPage.style.display = "none" ;
        endPage.style.display = "none" ;
        tbody.innerHTML = " " ;
        index = 0 ;
        correct.classList.remove("float-up") ;
        record = [] ;
        deleteSign() ;
    }else{
        window.location.href = "main.html";
    }
}

const triggerFloat = (element) => {
    element.classList.add('float-up');
    element.addEventListener('animationend', () => {
        element.classList.remove('float-up');
    });
} ;

updateCategory() ;