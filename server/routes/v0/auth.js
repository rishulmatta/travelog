const User = require('models/user'),
    {errorProcessor} = require('server_utils/error');

module.exports.register = function (req, res, next) {

    const {firstname, lastname, username, password} = req.body;
    let newUser = new User({firstname, lastname, username, password});

    newUser.save(function (err, user) {
        if (err) {
            return errorProcessor(err, res);
        }
        else {
            return res.json(user);
        }
    });
};

module.exports.logIn = function (req, res, next) {
    if (req.session && req.session.user) {
        // if already logged in then pick data from session.
        return res.json(req.session.user);
    }
    const {username, password} = req.body;

    User.authorize(username, password, function (err, user) {
        if (err) {
            return errorProcessor(err, res);
        }
        else {
            req.session.user = user;
            return res.json(user);
        }
    });
};

module.exports.isLoggedIn = function (req, res, next) {
    if (req.session && req.session.user) {
        // if already logged in then pick data from session.
        return res.json(req.session.user);
    } else {
        return res.json(false);
    }
};

module.exports.logout = function (req, res, next) {
    if (req.session) {
        req.session.destroy(function (err) {
            if (err) {
                return errorProcessor(err, res);
            } else {
                return res.json({msg: 'Session cleared'});
            }
        });
    } else {
        return errorProcessor('No Session to kill', res);
    }
};