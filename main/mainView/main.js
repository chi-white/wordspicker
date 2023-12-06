

const doubleGame = () => {
    window.location.href = 'doublegame.html' ;
} ;
    
const testMode = () => {
    window.location.href = 'testMode.html' ;
}

const practiceMode = () => {
    window.location.href = 'practiceMode.html' ;
}


const logout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = 'user.html';
} ;
