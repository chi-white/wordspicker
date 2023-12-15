const toggleForm = (formId) => {
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

        const url = "http://localhost/api/1.0/user/signup";

        const response = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });

        const responseData = await response.json();

        if (responseData.err) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: responseData.err,
            });
        } else {
            console.log('Success:', responseData);
        
            Swal.fire({
                icon: 'success',
                title: 'Congratulation',
                text: "Successfully signed up",
            });
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

        const loginurl = 'http://localhost/api/1.0/user/login';
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

const switchElement = document.getElementById("mySwitch");
const switchCheckbox = document.getElementById("switchCheckbox");

switchElement.addEventListener("click", () => {
    if (switchCheckbox.checked) {
        toggleForm('loginForm');
    } else {
        toggleForm('signupForm');
    }
});