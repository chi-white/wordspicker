// const {host} = require('../../host.js') ;
const host = 'https://kimery.store' ;
const categorySelect = document.getElementById("category");
const chapterSelect = document.getElementById("chapter");
const accordion =  document.getElementById("Accordion");

const deleteFavorite = async (wordId) => {
    const url = `${host}/deleteFavorite?wordId=${wordId}` ;

    const response = await fetch(url, {
        method : "GET",
        headers : {'Content-Type': 'application/json'},
    }) ;
    const responseFrame = await response.json() ;
    const responseData = responseFrame.data ;
}

const queryFavorite = async (wordId) => {
    const url = `${host}/queryFavorite?wordId=${wordId}` ;
    const response = await fetch(url, {
        method : "GET",
        headers : {'Content-Type': 'application/json'},
    }) ;
    const responseFrame = await response.json() ;
    const responseData = responseFrame.data ;
    return responseData ;
}

const addFavorite = async(wordId) => {
    const url = `${host}/addFavorite?wordId=${wordId}` ;
    const response = await fetch(url, {
        method : "GET",
        headers : {'Content-Type': 'application/json'},
    }) ;
    const responseFrame = await response.json() ;
    const responseData = responseFrame.data ;
} ;



const updateWords = async () => {
    if (categorySelect.value === "" || chapterSelect.value === ""){
        alert("Please select category and chapter") ;
    }else{
        let url ;
        if (categorySelect.value === "favorite"){
            url = `${host}/getFavoriteWords` ;
        }else{
            url = `${host}/getWords?category=${categorySelect.value}&chapter=${chapterSelect.value}` ;
        }
        const response = await fetch(url, {
            method : "GET",
            headers : {'Content-Type': 'application/json'},
        }) ;
        const responseFrame = await response.json() ;
        const responseData = responseFrame.data ;
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

const fillAccordion = async() => {
    accordion.innerHTML = "" ;
    let itemCount = 0 ;
    const words = await updateWords() ;
    for(let word of words){
        const newItem = document.createElement('div');
        newItem.className = 'accordion-item';
      
        const newHeader = document.createElement('div'); 
        newHeader.className = 'accordion-header';
      
        const newButton = document.createElement('button'); 
        newButton.className = 'accordion-button fw-bold';
        newButton.type = 'button';
        newButton.setAttribute('data-bs-toggle', 'collapse');
        newButton.setAttribute('data-bs-target', `#${itemCount}`);
        newButton.innerText = `${word.english} (${word.abbreviation}.)`;
      
        const newCollapse = document.createElement('div'); 
        newCollapse.id = `${itemCount}`;
        newCollapse.className = 'collapse show accordion-collapse';
      
        const newBody = document.createElement('div'); 
        newBody.className = 'accordion-body';
        
        const newrow = document.createElement('div') ;
        newrow.className = 'row justify-content-center' ;

        const leftcol = document.createElement('div') ;
        leftcol.className = "col-1 fw-bold d-flex text-center justify-content-center align-items-center m-0 p-0 flex-column" ;
        leftcol.innerText = ` ${word.english}` ;
        const icon = document.createElement('i') ;
        const f = await queryFavorite(word.id) ; 
        if(f.length>0) icon.classList.add('bi', 'bi-heart-fill', 'mt-2');
        else icon.classList.add('bi', 'bi-heart', 'mt-2');
        icon.setAttribute('onclick', `editFavorite(this, ${word.id})`);
        leftcol.appendChild(icon);

        const middlecol = document.createElement('div') ;
        middlecol.className = "col-1 d-flex justify-content-center  m-0 p-0" ;

        const line = document.createElement('div') ; 
        line.className = "vertical-line" ;
        middlecol.appendChild(line) ;

        const rightcol = document.createElement('div') ;
        rightcol.className = "col-8" ;

        const listGroup = document.createElement('ul');
        listGroup.className = 'list-group list-group-flush';
    

        const item1 = document.createElement('li');
        item1.className = "list-group-item" ;
        const badge1 = document.createElement('span');
        badge1.className = "badge bg-success" ;
        badge1.innerText = "詞性" ;
        item1.appendChild(badge1) ;
        item1.innerHTML += ` ${word.abbreviation}.` ;

        const item2 = document.createElement('li');
        item2.className = "list-group-item" ;
        const badge2 = document.createElement('span');
        badge2.className = "badge bg-primary" ;
        badge2.innerText = "中文解釋" ;
        item2.appendChild(badge2) ;
        item2.innerHTML += ` ${word.chinese}` ;


        const item3 = document.createElement('li');
        item3.className = "list-group-item" ;
        const badge3 = document.createElement('span');
        badge3.className = "badge bg-info" ;
        badge3.innerText = "例句" ;
        item3.appendChild(badge3) ;
        item3.innerHTML += ` ${word.example}` ;
        const c = document.createElement("div") ;
        c.className = "chinese-sentence" ;
        c.innerText = ` ${word.example_chinese}` ;
        item3.appendChild(c) ;

        listGroup.appendChild(item1) ;
        listGroup.appendChild(item2) ;
        listGroup.appendChild(item3) ;

        if(word.related.length>0){
            const item4 = document.createElement('li');
            item4.className = "list-group-item" ;
            const badge4 = document.createElement('span');
            badge4.className = "badge bg-secondary" ;
            badge4.innerText = "相似詞" ;
            item4.appendChild(badge4) ;
            item4.innerHTML += ` ${word.related}` ;
            listGroup.appendChild(item4) ;
        }
        
        rightcol.append(listGroup) ;
        newrow.appendChild(leftcol) ;
        newrow.appendChild(middlecol) ;
        newrow.appendChild(rightcol) ;
        newBody.appendChild(newrow);
        newHeader.appendChild(newButton); 
        newCollapse.appendChild(newBody); 
        newItem.appendChild(newHeader); 
        newItem.appendChild(newCollapse); 
        accordion.appendChild(newItem); 

        itemCount++ ;
    }
  
    if(words.length===0){
        const info = document.createElement('h1') ;
        info.className = 'd-flex justify-content-center align-items-center text-light fw-bold' ;
        info.innerText = "No Data!" ;
        accordion.appendChild(info) ;
    }
    
}

async function editFavorite (element, wordId) {
    if (element.classList.contains('bi-heart')) {
        element.classList.remove('bi-heart');
        element.classList.add('bi-heart-fill');
        await addFavorite(wordId) ;
    } else {
        element.classList.remove('bi-heart-fill');
        element.classList.add('bi-heart');
        await deleteFavorite(wordId) ;
    }

} 

 updateCategory() ;


 




