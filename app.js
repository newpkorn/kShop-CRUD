const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const route  = require('./router/routers');
const session = require('express-session');
const flash = require('connect-flash');
const mongoose = require('mongoose');

const app = express();

dotenv.config({ path: 'config.env' });
const PORT = process.env.PORT;
const conStr = process.env.MONGGODB_URL;

// MongoDB Connection
mongoose.connect(conStr, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Database connected successfully');
}).catch(error => console.log(error));

global.loggedIn = null;
global.loggedUser = null;

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({
    extended: false
}));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use('*', (req, res, next) => {
    loggedIn =  req.session.userId;
    loggedUser = req.session.userName;
    next();
});

app.use(express.static(path.join(__dirname,'public')));
app.use(flash());

// log requests
app.use(morgan('tiny'));

app.use(route);

app.listen(PORT, () => {
    console.log(`The server listening at http://localhost:${PORT}`);
});