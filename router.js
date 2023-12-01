const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const handleSocketEvents = require('./socket/socketController');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = 3000;

app.use(express.json());

/**------------token------------- */
const {checkJwtToken, checkAuth} = require('./token/tokenController') ;
/**------------user-------------- */
const userController = require('./user/userController') ;
const {insertUser, signinUser} = userController ;

app.post('/user/signup', insertUser) ;
app.post('/user/login', signinUser) ;

app.get('/user/user.html', (req, res) => {res.redirect('/user.html');});
app.use(express.static('user/userView')) ;



/**- google third part login----- */
const {googlelogin, googleInsertUser} = userController ;
const session = require('express-session');
const passport = require('./user/googlepassport'); // google third part login passport
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET' 
  }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/error' }),
  (req, res) => {
    res.redirect('/success');
});

app.get('/success', googleInsertUser, googlelogin);
  
  app.get('/error', (req, res) => res.send("error logging in"));

/**----------- main page------------ */
app.get('/main.html', checkJwtToken, checkAuth("main_html")) ;
app.use(express.static('main/mainView')) ;

/**-------------doublegame----------- */
app.use(express.static('doublegame/doublegameView')) ;
handleSocketEvents(io) ;
/**------------server-------------- */
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});