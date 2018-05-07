/*
* Set of middlewares which will be called before the actual call to databases
* */
const {errorProcessor} = require('server_utils/error');

module.exports.validateUserRegistration = (req, res, next) => {
    const {password} = req.body;
    req.checkBody('firstname', 'Name is required').notEmpty();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(password);

    var errors = req.validationErrors();
    if (errors) {
        return errorProcessor(errors.map(({msg, param}) => {
            return {msg, param}
        }), res);
    }
    next();
};

module.exports.validateLogIn = (req, res, next) => {
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        return errorProcessor(errors.map(({msg, param}) => {
            return {msg, param}
        }), res);
    }
    next();
};