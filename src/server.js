const express = require('express');
const app = express();

const path =require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const morgan = require('morgan');
const cookieParser = require('cookie-Parser');
const bodyParser = require('body-parser');
const session = require('express-session');

const {url} = require('./config/database');

mongoose.connect(url, {
	useMongoClient: true
});

//primero necesitamos configurarlo e inicializarlo
require('./config/passport')(passport);

//settings
//primero verifica si el sistema tiene un puerto por defecto, sino le da el 3000
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','ejs');

//middlewares
app.use(morgan('dev')); // para visualizar en consola las peticiones
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
// required for passport
app.use(session({
	secret: 'universidadasutral',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//routes
require('./app/routes.js')(app, passport);


//static files
app.use(express.static(path.join(__dirname, 'public')));


app.listen(app.get('port'), () => {
    console.log('server on port ', app.get('port'))
})