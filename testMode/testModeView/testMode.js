const socket = io('http://localhost');
let currentEvent ;
let answerNumber = 0;
const categorySelect = document.getElementById("category");
const chapterSelect = document.getElementById("chapter");
const questionTypeSelect = document.getElementById("questionType");
const selectPage = document.getElementById("selectPage");
const testPage = document.getElementById("testPage");
const endPage = document.getElementById("endPage");
const input = document.getElementById('wordsinput') ;
const wordPlace = document.getElementById('wordsdisplay') ;
const time = document.getElementById("time") ;
const correct = document.getElementById("correct") ;
const revise = document.getElementById("revise") ;
const questionType = [] ;
var questionNumber = 3 ;
var sendAns = false ;

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

const questionRequest = async () => {
    if (categorySelect.value === "" || chapterSelect.value === ""){
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please choose category and chapter!',
        });
    }else{
        socket.emit("setTestWords", {
            category : categorySelect.value,
            chapter : chapterSelect.value,
            questionNumber : questionNumber,
            questionType : questionTypeSelect.value}) ;
    } ;
}

socket.on("setSucessfully", () => {
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
    await countdownAndReply(index) ;
} ;

const countdownAndReply = (index) => {
    return new Promise((resolve) => {
        countdown = 10;
        if(currentEvent){
            input.removeEventListener('keydown', currentEvent) ;
        } ;
        currentEvent = (event) => {handleEnterKey(event, index)};
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
                    socket.emit("sendTestAnswer", {answer: input.value, index:index}) ;
                }
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

/** time enter to send message function */
const handleEnterKey = (event, index) => {
    if(event.keyCode === 13){
        const inputValue = input.value ;
        input.value = "" ;
        input.disabled = true ;
        socket.emit("sendTestAnswer", {answer: inputValue, index:index}) ;
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
        correct.textContent = data.word ;
        triggerFloat(correct) ;
    }
}) ;




const goToEnd = () => {
    socket.emit("deleteTestRecord") ;
    questionNumber = 3 ;
    testPage.style.display = "none" ;
    endPage.style.display = "flex" ;
}

const backMain = () => {
    window.location.href = 'main.html';
} ;

const backSelect = () => {
    endPage.style.display = 'none' ;
    selectPage.style.display = 'flex' ;
} ;

const backTest = () => {
    endPage.style.display = 'none' ;
    testPage.style.display = 'flex' ;
    correct.textContent = "" ;
    time.textContent = "" ;
    socket.emit("setTestWords", {
        category : categorySelect.value,
        chapter : chapterSelect.value,
        questionNumber : questionNumber,
        questionType : questionTypeSelect.value}) ;
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
