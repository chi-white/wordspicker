const urlParams = new URLSearchParams(window.location.search);
const googleauth = urlParams.get('googleauth');
if (googleauth === 'true') {
    alert('Successfully signed in'); 
}

function toggleForm(formId) {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');

    if (formId === 'loginForm') {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
        loginBtn.style.backgroundColor = '#3498db';
        signupBtn.style.backgroundColor = '#ddd';
    } else {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
        loginBtn.style.backgroundColor = '#ddd';
        signupBtn.style.backgroundColor = '#3498db';
    }
}


async function signup() {
    try {
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;

        const data = {
            'name': name,
            'mail': email,
            'password': password,
            'provider': 'native'
        };

        const url = process.env.SIGNUP_API;

        const response = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });

        const responseData = await response.json();

        if (responseData.err) {
            alert(responseData.err);
        } else {
            console.log('Success:', responseData);
            alert("Successfully signed up");
        }
    } catch (error) {
        console.error('Error:', error);
        alert(error.message || 'An error occurred.');
    }
}


async function login() {
    try {
        const provider = document.getElementById('loginProvider').value;
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        const data = {
            'provider': provider,
            'email': email,
            'password': password
        };

        const loginurl = 'https://kimery.store/api/1.0/user/signin';
        const response = await fetch(loginurl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const responseData = await response.json();

        if (responseData.err) {
            alert(responseData.err);
        } else {
            console.log('Success:', responseData);
            console.log(document.cookie) ;
            alert("Successfully signed in");
        }
    } catch (error) {
        console.error('Error:', error);
        alert(error.message || 'An error occurred.');
    }

    
}