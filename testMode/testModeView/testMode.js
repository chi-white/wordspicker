const socket = io('http://localhost');
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
var finalScore = 0 ;
const questionType = [] ;
var questionNumber = 2 ;
var sendAns = false ;
var initQuestionNumber = questionNumber;

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


const getCookie = async () => {
    const allCookies = document.cookie;
    const cookiesArray = allCookies.split(';');
    for (let i of cookiesArray){
        const [name, token] = i.split("=") ;
        if(name == "token"){
            return token ;
        }
    }
    return null ;
} ;

const questionRequest = async () => {
    if (categorySelect.value === "" || chapterSelect.value === ""){
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please choose category and chapter!',
        });
    }else{
        const cook = await getCookie() ;
        if(cook == null){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'NO token!',
            });
        }else{
            console.log(cook) ;
            socket.emit("setTestWords", {
            category : categorySelect.value,
            chapter : chapterSelect.value,
            questionNumber : questionNumber,
            questionType : questionTypeSelect.value,
            mode : modeSelect.value,
            token:cook}) ;
        }
    } ;
}




socket.on("setSucessfully", (data) => {
    questionNumber = data.questionNumber ;
    selectPage.style.display = "none" ;
    testPage.style.display = "flex" ;
    wordsIteration() ;
}) ;

const wordsIteration = async() => {
    for(let index=0; index<questionNumber; index++){
        await new Promise((resolve, reject) => {
            socket.emit("getTestWords", {index : index}) ;
            socket.once("getTestWords", async(data) => {
                correct.textContent = "" ;
                revise.textContent = "" ;
                sendAns = false ;
                await getWordsHandle(data) ;
                input.value = "" ;
                resolve() ;
            })
        }) ;
    }
    goToEnd() ;
} ;


const getWordsHandle = async (data) => {
    const index = data.index ;
    wordPlace.textContent  = data.word+` (${data.abbreviation}.)` ;
    input.disabled = false ;
    input.focus();
    await countdownAndReply(index, data.wordid) ;
} ;

const countdownAndReply = (index, wordid) => {
    return new Promise((resolve) => {
        countdown = 10;
        if(currentEvent){
            input.removeEventListener('keydown', currentEvent) ;
        } ;
        currentEvent = (event) => {handleEnterKey(event, index, wordid)};
        input.addEventListener('keydown', currentEvent);

        const countdownTimer = setInterval(() => {
            countdown--;
            if(answerNumber === 1){
                countdown = 0 ;
                answerNumber = 0 ;
            }else if (countdown === 0) {
                input.disabled = true ;
                time.textContent = time.textContent ;
                if(!sendAns){
                    socket.emit("sendTestAnswer", {answer: input.value, index:index, wordid:wordid, token:cook}) ;
                }
            }else if(countdown <= -2){
                countdown = 10 ;
                clearInterval(countdownTimer);  
                resolve() ;
            }else if(countdown > 0){
                time.textContent = countdown ;
            }
        }, 1000) ;
    })
} ;

/** time enter to send message function */
const handleEnterKey = async (event, index, wordid) => {
    if(event.keyCode === 13){
        const inputValue = input.value ;
        input.value = "" ;
        input.disabled = true ;
        const cook = await getCookie() ;
        console.log(cook, "cook") ;
        socket.emit("sendTestAnswer", {answer: inputValue, index:index, token:cook, wordid:wordid}) ;
        sendAns = true ;
        input.removeEventListener('keydown', currentEvent);
    }
} ;

socket.on("testAnswerResponse", (data) => {
    answerNumber++ ;
    if(data.answer === false){
        questionNumber++ ;
        revise.textContent = data.word ;
        document.body.classList.add('condition-met');
        document.body.addEventListener('animationend', () => {
            document.body.classList.remove('condition-met');
        }) ;
    }else{
        console.log(data.index) ;
        if(data.index<initQuestionNumber){
            finalScore += 100/initQuestionNumber ;
            console.log(finalScore) ;
        }else if(data.index<initQuestionNumber*2){
            finalScore += 50/initQuestionNumber ;
        }else{
            finalScore += 10/initQuestionNumber ; 
        }
        correct.textContent = data.word ;
        triggerFloat(correct) ;
    }
}) ;




const goToEnd = async () => {
    cook = await getCookie() ;
    socket.emit("deleteTestRecord", {token:cook,category:categorySelect.value, chapter:chapterSelect.value}) ;
    questionNumber = initQuestionNumber ;
    testPage.style.display = "none" ;
    endPage.style.display = "flex" ;
    finalScoreShow.textContent = (Math.floor(finalScore)).toString() ;
    finalScore = 0 ;
}

const backMain = () => {
    window.location.href = 'main.html';
} ;

const backSelect = () => {
    endPage.style.display = 'none' ;
    selectPage.style.display = 'flex' ;
} ;

const backTest = async() => {
    endPage.style.display = 'none' ;
    testPage.style.display = 'flex' ;
    correct.textContent = "" ;
    time.textContent = "" ;
    wordPlace.textContent = "" ;
    const cook = await getCookie() ;
    socket.emit("setTestWords", {
        category : categorySelect.value,
        chapter : chapterSelect.value,
        questionNumber : questionNumber,
        questionType : questionTypeSelect.value,
        token:cook}) ;
}  ;

const back = () => {
    if(selectPage.style.display == "none"){
        selectPage.style.display = "flex" ;
        testPage.style.display = "none" ;
        endPage.style.display = "none" ;
        console.log(selectPage.style.display) ;
    }else{
        window.location.href = "main.html";
    }
}

const home = () => {
    window.location.href = "main.html"; 
}

const logout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "user.html"; 
} ;


const triggerFloat = (element) => {
    element.classList.add('float-up');
    element.addEventListener('animationend', () => {
        element.classList.remove('float-up');
    });
} ;
