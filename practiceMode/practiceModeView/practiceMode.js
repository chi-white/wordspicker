const categorySelect = document.getElementById("category");
const chapterSelect = document.getElementById("chapter");
const selectPage = document.getElementById("selectPage") ;
const wordPage = document.getElementById("wordPage") ;
const flashcardContainer = document.getElementById('flashcardContainer');
const overlay = document.getElementById('overlay') ;
const popup = document.getElementById('popup') ;
const flashcardDetail = document.getElementById('flashcardDetail') ;
var slide = "close" ;
let word ;


const generateFlashcards = async () => {
    wordPage.style.display = "block" ;
    selectPage.style.display = "none" ;
    const words = await updateWords() ;

    const numCards = words.length ;
    flashcardContainer.innerHTML = '';
    for (let i = 0; i < numCards; i++) {
        word = words[i] ;

        const cardDiv = document.createElement('div');
        cardDiv.setAttribute("data-word-english", word.english);
        const currentWord = cardDiv.getAttribute('data-word-english');
        cardDiv.setAttribute("data-word-id", word.id);
        cardDiv.className = 'flashcard';
        cardDiv.innerHTML += `
        <p class="flashcard-header">
            ${word.english}  ${word.abbreviation} ${word.chinese}
        </p>
        <p class="flashcard-example">
            例句：<br>${word.example}
        </p>
        `;
        cardDiv.style.opacity = '1';


        const starElement = document.createElement('span');

        const favoriteExist = await queryFavorite(word.id) ;
        if(favoriteExist.length === 0){
            cardDiv.setAttribute("data-clicked", "notFavorite");  
            starElement.style.color = 'rgba(0, 0, 0, 0)' ;
        }else{
            cardDiv.style.backgroundColor = '#e0f7fa';
            cardDiv.setAttribute('data-clicked', "Favorite");
            starElement.style.color = 'rgb(255, 247, 15)' ;
        }
        

        starElement.onclick = async () => {
            if (cardDiv.getAttribute('data-clicked') === "Favorite") {
                cardDiv.style.backgroundColor = '#fff';
                cardDiv.setAttribute('data-clicked', "notFavorite");
                starElement.style.color = 'rgba(0, 0, 0, 0)' ;
                const wordId = cardDiv.getAttribute('data-word-id');
                await deleteFavorite(wordId) ;
            } else {
                cardDiv.style.backgroundColor = '#e0f7fa';
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
            overlay.style.display = 'flex';
            // const cardDiva = document.createElement('div');
            flashcardDetail.innerHTML = `

                <p class="flashcard-header">
                    ${word.english}  ${word.abbreviation} ${word.chinese}
                </p>
                <p class="flashcard-example">
                    例句：<br>${word.example}
                </p>

            `;
            popup.appendChild(flashcardDetail) ;
        } ;

        flashcardContainer.appendChild(cardDiv);
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
    const url = `http://localhost/deleteFavorite?wordId=${wordId}` ;
    const response = await fetch(url, {
        method : "GET",
        headers : {'Content-Type': 'application/json'},
    }) ;
    const responseFrame = await response.json() ;
    const responseData = responseFrame.data ;
    console.log(responseData, wordId) ;
}

const queryFavorite = async (wordId) => {
    const url = `http://localhost/queryFavorite?wordId=${wordId}` ;
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
    const url = `http://localhost/addFavorite?wordId=${wordId}` ;
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

const updateWords = async () => {
    if (categorySelect.value === "" || chapterSelect.value === ""){
        alert("Please select category and chapter") ;
    }else{
        const url = `http://localhost/getWords?category=${categorySelect.value}&chapter=${chapterSelect.value}` ;
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

const controlSidebar = () => {
    if (slide === "close"){
        document.getElementById('sidebar').style.width = '0px';
        slide = "open" ;
    }else{
        document.getElementById('sidebar').style.width = '250px';
        slide = "close" ;
    }
} ;
