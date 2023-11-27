// 假设你点击登出按钮时要执行的操作
document.getElementById('logoutButton').addEventListener('click', function() {
    // 在这里添加登出的相关逻辑，比如清除用户信息、跳转到登录页面等
    alert('已登出');
});

// 假设你点击进入游戏按钮时要执行的操作
document.getElementById('goToGameButton').addEventListener('click', function() {
    window.location.href = 'doublegame.html';
});
