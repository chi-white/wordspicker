const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const port = 2000;

app.use(express.json());

/**------------user-------------- */
const userController = require('./user/userController') ;
const {insertUser, signinUser} = userController ;

app.post('/user/signup', insertUser) ;
app.post('/user/login', signinUser) ;

app.use(express.static('user/userView')) ;
app.get('/user/user.html', (req, res) => {res.redirect('/user.html');});


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
app.use(express.static('main/mainView')) ;
app.use(express.static('doublegame/doublegameView')) ;

/**------------server-------------- */
server.listen(3000, () => {
    console.log('Server is running on port 3000');
});