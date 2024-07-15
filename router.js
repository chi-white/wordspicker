const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const {handleDoublegameSocket} = require('./doublegame/doublegameController');
const {handleTestModeSocket} = require('./testMode/testModeController') ;
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
  passport.authenticate('google', { failureRedirect: '/error' }),(req, res) => {
    res.redirect('/success');
});

app.get('/success', googleInsertUser, googlelogin);
  
  app.get('/error', (req, res) => res.send("error logging in"));

/**----------- main page------------ */
app.get('/main.html', checkJwtToken, checkAuth("main_html")) ;
app.use(express.static('main/mainView')) ;

const {getDiagramData, getUserInfo} = require('./main/mainController');
// app.get('/diagram', getDiagramData) ;

app.get('/getUserInfo', checkJwtToken, checkAuth("main_html"), getUserInfo) ;

/**-------------doublegame----------- */
app.get('/doublegame.html', checkJwtToken, checkAuth("doublegame_html")) ;
app.use(express.static('doublegame/doublegameView')) ;
handleDoublegameSocket(io) ;

const {getChapter} = require('./doublegame/doublegameController');
app.get('/getchapter', getChapter) ;

//**------------practice mode------ */
app.get('/practiceMode.html', checkJwtToken, checkAuth("practicemode_html")) ;
app.use(express.static('practiceMode/practiceModeView')) ;

const {addFavorite, queryFavorite, deleteFavorite, getFavoriteWords} = require('./practiceMode/practiceModeController') ;
app.get('/addFavorite', addFavorite) ;
app.get('/queryFavorite', queryFavorite) ;
app.get('/deleteFavorite', deleteFavorite) ;
app.get('/getFavoriteWords', getFavoriteWords) ;

const {getWords} = require('./practiceMode/practiceModeController') ;
app.get('/getwords', getWords) ;

//**------------test mode---------- */
app.get('/testMode.html', checkJwtToken, checkAuth("testmode_html")) ;
app.use(express.static('testMode/testModeView')) ;
handleTestModeSocket(io) ;


/**------------server-------------- */
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});