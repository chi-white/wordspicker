// const {host} = require('../../host.js') ;
const host = 'https://kimery.store' ;

const brand = document.getElementById("brand") ;

const logout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
} ;

const getUserName = async() => {
    url = host+ "/getUserInfo" ;
    const response = await fetch(url, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    });
    const responseFrame = await response.json() ;
    const responseData = responseFrame.data ;
    brand.innerText = `WordsPicker  Hi! ${responseData.name}` ;
    
}

getUserName() ;






