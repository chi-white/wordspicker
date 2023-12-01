

document.getElementById('goToGameButton').addEventListener('click', function() {
    window.location.href = 'doublegame.html';
});

const logout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = 'user.html';
}
