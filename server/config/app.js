require('module-alias/register');
const express = require('express'),
    logger = require('morgan'),
    passport = require('passport'),
    expressSession = require('express-session'),
    expressValidator = require('express-validator'),
    mongoose = require('mongoose'),
    MongoStore = require('connect-mongo')(expressSession),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    routesInitialize = require('routes/index'),
    config = require('./settings');

// Initialize app
const app = express();
app.use(logger('dev'));
mongoose.connect(config["mongoose"].uri, {useMongoClient: true}, function (err) {
    if (err) {
        console.log("Mongo DB not started");
        process.exit();
    }
});

// Setup
app.use(passport.initialize());
app.use(passport.session());
app.use(expressValidator({
    errorFormatter: config['errorFormatter'],
}));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cookieParser('23dert42w', {
    httpOnly: true,
    sameSite: true
}));
app.use(expressSession(Object.assign({},
    config['session'],
    {store: new MongoStore({mongooseConnection: mongoose.connection})})));


app.use(function (req, res, next) {
    // sanitize user input if special characters come in
    for (var item in req.params) {
        req.sanitize(item).escape();
    }

    for (var item in req.body) {
        req.sanitize(item).escape();
    }

    for (var params in req.query) {
        req.sanitize(params).escape();
    }
    next();
});


// Initialize rest routes
routesInitialize(app);

module.exports = app;