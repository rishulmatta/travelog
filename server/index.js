const app = require('./config/app'),
    express = require('express'),
    path = require('path'),
    config = require('./config/settings');

if (process.env.NODE_ENV == 'production') {
    // Express will serve prod assets as no webpack server
    app.use(express.static(path.join(__dirname, "../client/dist")));
    app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname, "../client/dist/index.html"))
    });
}

// Dynamic port binding.
const PORT = process.env.PORT || config.port;
app.listen(5000);