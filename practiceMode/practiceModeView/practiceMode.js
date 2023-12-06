const categorySelect = document.getElementById("category");
const chapterSelect = document.getElementById("chapter");
const selectPage = document.getElementById("selectPage") ;
const wordPage = document.getElementById("wordPage") ;
const flashcardContainer = document.getElementById('flashcardContainer');

const flashcardsData = [
    { english: 'chill', chinese: '寒冷；寒意', partOfSpeech: '(n.)', example: 'The chill comes with winter' },
];

const generateFlashcards = () => {
    wordPage.style.display = "block" ;
    selectPage.style.display = "none" ;
    const numCards = 2 ;
    flashcardContainer.innerHTML = '';
    const flashcard = flashcardsData[0] ;
    for (let i = 0; i < numCards; i++) {

        const cardDiv = document.createElement('div');
        cardDiv.setAttribute("data-clicked", false);

        cardDiv.onclick = () => {
            if (cardDiv.getAttribute('data-clicked') == "true") {
                cardDiv.style.backgroundColor = '#fff';
                cardDiv.setAttribute('data-clicked', false);
                const starElement = cardDiv.querySelector('.star');
                if (starElement) {
                cardDiv.removeChild(starElement);
                }
            } else {
                cardDiv.style.backgroundColor = '#e0f7fa';
                cardDiv.setAttribute('data-clicked', true);

                const starElement = document.createElement('span');
                starElement.className = 'star';
                starElement.innerHTML = '&#9733;';
                cardDiv.appendChild(starElement);

                showNotification(`${flashcard.english} is added to Favorite`);
            }
        };

        cardDiv.className = 'flashcard';

        cardDiv.innerHTML = `
        <p class="flashcard-header">
            ${flashcard.english}  ${flashcard.partOfSpeech} ${flashcard.chinese}
        </p>
        <p class="flashcard-example">
            例句：<br>${flashcard.example}
        </p>
        `;

        flashcardContainer.appendChild(cardDiv);
    }
}

const showNotification = (message) => {
const notification = document.createElement('div');
notification.className = 'notification';
notification.textContent = message;

document.body.appendChild(notification);

setTimeout(() => {
    document.body.removeChild(notification);
}, 2000);
} ;

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