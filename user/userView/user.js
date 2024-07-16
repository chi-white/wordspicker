// const {host} = require('../../host.js') ;
const host = 'https://kimery.store' ;

const welcomePage = document.getElementById('welcomePage');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

const t = new URLSearchParams(window.location.search).get('token');
if(t){
    Swal.fire({
        icon: 'error',
        title: 'Without legal token',
        text:  "Register or Login First",
    });
}



const signup = async () => {
    try {
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;

        const data = {
            'name': name,
            'email': email,
            'password': password,
            'provider': 'native'
        };

        const url = `${host}/user/signup`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });

        const responseData = await response.json();

        if (responseData.err) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...haha',
                text: responseData.err,
            });
        } else {
            console.log('Success:', responseData);
            
            await Swal.fire({
                icon: 'success',
                title: 'Congratulation',
                text: "Successfully signed up",
            });
            window.location.href = 'user.html' ;

            
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error || "An Error Ocurred",
        });
    }
}


const login = async () => {

    try {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        const data = {
            'provider': 'native',
            'email': email,
            'password': password
        };

        const loginurl = `${host}/user/login`;
        const response = await fetch(loginurl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const responseData = await response.json();

        if (responseData.err) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: responseData.err || "An Error Ocurred",
            })
        } else {
            console.log('Success:', responseData);
            window.location.href = 'main.html' ;
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error || "An Error Ocurred",
        })
    }
}

const oauth2 = () => {
    window.location.href = '/auth/google';
}

const goToSigup = () => {
    welcomePage.style.display = 'none' ;
    loginForm.style.display = 'none' ;
    signupForm.style.display = 'block' ;
}

const goToLogin = () => {
    welcomePage.style.display = 'none' ;
    signupForm.style.display = 'none' ;
    loginForm.style.display = 'block' ;
}

const goToWelcome = () => {
    loginForm.style.display = 'none' ;
    signupForm.style.display = 'none' ;
    welcomePage.style.display = 'block' ;
}

