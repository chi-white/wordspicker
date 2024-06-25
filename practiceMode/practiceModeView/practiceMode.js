const selectPage = document.getElementById("selectPage") ;
const wordPage = document.getElementById("wordPage") ;
const categorySelect = document.getElementById("category");
const chapterSelect = document.getElementById("chapter");
const flashcardContainer = document.getElementById('flashcardContainer');
const overlay = document.getElementById('overlay') ;
const popup = document.getElementById('popup') ;
const flashcardDetail = document.getElementById('flashcardDetail') ;
const prevButton = document.getElementById("prevButton") ;
const nextButton = document.getElementById("nextButton") ;
var slide = "close" ;
var currentIndex ;
var words ;

const generateFlashcards = async () => {
    if(categorySelect.value === "" || chapterSelect.value === ""){
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please choose category and chapter!',
        });
    }else{
        wordPage.style.display = "flex" ;
        selectPage.style.display = "none" ;
        words = await updateWords(categorySelect.value) ;

        const numCards = words.length ;
        flashcardContainer.innerHTML = '';
        for (let i = 0; i < numCards; i++) {
            let word = words[i] ;

            const cardDiv = document.createElement('div');
            cardDiv.setAttribute("index", i) ;
            cardDiv.setAttribute("english", word.english);
            const currentWord = cardDiv.getAttribute('english');
            cardDiv.setAttribute("data-word-id", word.id);
            cardDiv.className = 'flashcard';
            cardDiv.innerHTML += `
            <p class="flashcard-header">
                ${word.english}&nbsp;&nbsp;&nbsp;&nbsp;(${word.abbreviation}.)&nbsp;&nbsp;&nbsp;&nbsp;${word.chinese}
            </p>
            <p class="flashcard-example">
                <br>${word.example}
            </p>
            `;
            cardDiv.style.opacity = '1';

            const starElement = document.createElement('span');

            const favoriteExist = await queryFavorite(word.id) ;
            if(favoriteExist.length === 0){
                cardDiv.setAttribute("data-clicked", "notFavorite");  
                starElement.style.color = '#9b9393' ;
            }else{
                cardDiv.setAttribute('data-clicked', "Favorite");
                starElement.style.color = 'rgb(255, 247, 15)' ;
            }
            

            starElement.onclick = async () => {
                if (cardDiv.getAttribute('data-clicked') === "Favorite") {
                    cardDiv.setAttribute('data-clicked', "notFavorite");
                    starElement.style.color = '#9b9393' ;
                    const wordId = cardDiv.getAttribute('data-word-id');
                    await deleteFavorite(wordId) ;
                } else {
                    cardDiv.setAttribute('data-clicked', "Favorite");
                    const wordId = cardDiv.getAttribute('data-word-id');
                    starElement.style.color = 'rgb(255, 247, 15)' ;
                    showNotification(`${currentWord} is added to Favorite`);
                    await addFavorite(wordId) ;
                }
            };
            starElement.className = 'star';
            starElement.innerHTML = '&#9733;';
            cardDiv.appendChild(starElement);

            cardDiv.ondblclick = async () => {
                currentIndex = cardDiv.getAttribute("index") ;
                console.log("doubleclick", currentIndex) ;
                if(currentIndex == 0){
                    prevButton.style.display = "none" ;
                    nextButton.style.display = "block" ;
                }else if(currentIndex == words.length - 1){
                    nextButton.style.display = "none" ;
                    prevButton.style.display = "block" ;
                }else{
                    prevButton.style.display = "block" ;
                    nextButton.style.display = "block" ;
                }
                popup.innerHTML = "" ;
                flashcardDetail.innerHTML = "" ;
                overlay.style.display = 'flex';
                const div = document.createElement('div');
                div.innerHTML = `

                    <p class="flashcard-header">
                        ${word.english} &nbsp;&nbsp;&nbsp;&nbsp;(${word.abbreviation}.)&nbsp;&nbsp;&nbsp;&nbsp; ${word.chinese}
                    </p>
                    <p class="flashcard-example">
                        <br>${word.example}
                    </p>
                    <p class="flashcard-example">
                        <br>${word.example_chinese}
                    </p>
                    <p class="flashcard-example">
                        <br>${word.related}
                    </p>
                `;
                flashcardDetail.appendChild(div) ;
                popup.appendChild(flashcardDetail) ;
            } ;
           

            flashcardContainer.appendChild(cardDiv);
        }
    }
}

const closePopup = () => {
    document.getElementById('overlay').style.display = 'none';
}

const overlayClick = (event) => {
    if (event.target === document.getElementById('overlay')) {
      closePopup();
    }
}

const deleteFavorite = async (wordId) => {
    const url = `https://kimery.store/deleteFavorite?wordId=${wordId}` ;

    const response = await fetch(url, {
        method : "GET",
        headers : {'Content-Type': 'application/json'},
    }) ;
    const responseFrame = await response.json() ;
    const responseData = responseFrame.data ;
    console.log(responseData, wordId) ;
}

const queryFavorite = async (wordId) => {
    const url = `https://kimery.store/queryFavorite?wordId=${wordId}` ;
    const response = await fetch(url, {
        method : "GET",
        headers : {'Content-Type': 'application/json'},
    }) ;
    const responseFrame = await response.json() ;
    const responseData = responseFrame.data ;
    console.log('query') ;
    return responseData ;
}

const addFavorite = async(wordId) => {
    const url = `https://kimery.store/addFavorite?wordId=${wordId}` ;
    const response = await fetch(url, {
        method : "GET",
        headers : {'Content-Type': 'application/json'},
    }) ;
    const responseFrame = await response.json() ;
    const responseData = responseFrame.data ;
    console.log('add', wordId) ;
} ;


const showNotification = (message) => {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        document.body.removeChild(notification);
    }, 2000);
} ;

const updateWords = async (category) => {
    if (categorySelect.value === "" || chapterSelect.value === ""){
        alert("Please select category and chapter") ;
    }else{
        let url ;
        if (category === "favorite"){
            url = `https://kimery.store/getFavoriteWords` ;
        }else{
            url = `https://kimery.store/getWords?category=${categorySelect.value}&chapter=${chapterSelect.value}` ;
        }
        const response = await fetch(url, {
            method : "GET",
            headers : {'Content-Type': 'application/json'},
        }) ;
        const responseFrame = await response.json() ;
        const responseData = responseFrame.data ;
        console.log(responseData) ;
        return responseData ;
    }
}

const updateCategory = async() => {
    chapterSelect.innerHTML = "" ;
    if (categorySelect.value === ""){
        chapterSelect.disabled = true ;
    }else if(categorySelect.value === "favorite"){
        var option = document.createElement("option");
        option.value = 1 ;
        option.text = 1 ;
        chapterSelect.add(option);
    }else{
        chapterSelect.disabled = false ;
        const url = `https://kimery.store/getChapter?category=${categorySelect.value}` ;
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

const controlSidebar = () => {
    if (slide === "close"){
        document.getElementById('sidebar').style.width = '0px';
        slide = "open" ;
    }else{
        document.getElementById('sidebar').style.width = '250px';
        slide = "close" ;
    }
} ;

const logout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "user.html"; 
} ;

const showPrevFlashcard = () => {
        currentIndex --;
        console.log("showPrevFlashcard", currentIndex) ;
        console.log(words[currentIndex].english) ;
        popup.innerHTML = "" ;
        flashcardDetail.innerHTML = "" ;
        overlay.style.display = 'flex';
        const div = document.createElement('div');
        div.innerHTML = `
            <p class="flashcard-header">
                ${words[currentIndex].english} &nbsp;&nbsp;&nbsp;&nbsp;(${words[currentIndex].abbreviation}.)&nbsp;&nbsp;&nbsp;&nbsp; ${words[currentIndex].chinese}
            </p>
            <p class="flashcard-example">
                <br>${words[currentIndex].example}
            </p>
            <p class="flashcard-example">
                <br>${words[currentIndex].example_chinese}
            </p>
            <p class="flashcard-example">
                <br>${words[currentIndex].related}
            </p>
        `;
        flashcardDetail.appendChild(div) ;
        popup.appendChild(flashcardDetail) ;
        if(currentIndex == 0){
            prevButton.style.display = "none" ;
        }
        nextButton.style.display = "block" ;

} ;

const showNextFlashcard = () => {
    currentIndex ++;
    console.log("showPrevFlashcard", currentIndex) ;
    console.log(words[currentIndex].english) ;
    popup.innerHTML = "" ;
    flashcardDetail.innerHTML = "" ;
    overlay.style.display = 'flex';
    const div = document.createElement('div');
    div.innerHTML = `
        <p class="flashcard-header">
            ${words[currentIndex].english} &nbsp;&nbsp;&nbsp;&nbsp;(${words[currentIndex].abbreviation}.)&nbsp;&nbsp;&nbsp;&nbsp; ${words[currentIndex].chinese}
        </p>
        <p class="flashcard-example">
            <br>${words[currentIndex].example}
        </p>
        <p class="flashcard-example">
            <br>${words[currentIndex].example_chinese}
        </p>
        <p class="flashcard-example">
            <br>${words[currentIndex].related}
        </p>
    `;
    flashcardDetail.appendChild(div) ;
    popup.appendChild(flashcardDetail) ;
    if(currentIndex == words.length - 1){
        nextButton.style.display = "none" ;

    }
    prevButton.style.display = "block" ;
} ;

const back = () => {
    if(selectPage.style.display == "none"){
        selectPage.style.display = "block" ;
        wordPage.style.display = "none" ;
    }else{
        window.location.href = "main.html"; 
    }
} ;

const home = () => {
    window.location.href = "main.html"; 
}
