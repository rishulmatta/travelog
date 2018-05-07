const User = require('models/user'),
    {errorProcessor} = require('server_utils/error');

function generateCallback(req, res) {
    return function (err, user) {
        if (err) {
            return errorProcessor(err, res);
        }
        else {
            return res.json(user);
        }
    }
}

module.exports.getAllUsers = function (req, res, next) {
    User.find({}).sort({firstname: 1}).exec((err, users) => {
        if (err) return next(err);
        res.json(users);
    });

}

module.exports.getUser = function (req, res, next) {

    User.find({_id: req.params.userid}).exec((err, user) => {
        if (err) return errorProcessor(err, res);
        if (user.length == 0) return errorProcessor('User Not Found, Please check the userid', res, 404);
        res.json(user);
    });
}

module.exports.deleteUser = function (req, res, next) {
    const userId = req.params.userid;
    User.deleteOne({_id: userId}, function (err, result) {
        if (err) return errorProcessor(err, res);
        if (result.deletedCount == 1) {
            return res.json({msg: `Successfully deleted: ${userId}`, isDeleted: true, id: userId});
        } else {
            return errorProcessor('User Not Found, Please check the userid', res, 404);
        }
    });
}

module.exports.patchUser = function (req, res, next) {
    const {firstname, lastname, username} = req.body;
    const updateableProperties = ['firstname', 'lastname', 'username'];
    User.findOne({_id: req.params.userid}, function (err, user) {
        if (err) return errorProcessor(err, res);
        if (!user) return errorProcessor('User not found', res, 404);

        for (let key in req.body) {
            if (updateableProperties.indexOf(key) == -1) {
                return errorProcessor(`${key} is not a valid property for this request. Use only: firstname, lastname, username`, res);
            } else {
                user.set({[key]: req.body[key]});
            }
        }

        user.save(generateCallback(req, res));
    });
}

module.exports.updateUser = function (req, res, next) {
    const {firstname, lastname, username, role} = req.body;
    const updateableProperties = ['firstname', 'lastname', 'username', 'role'];
    User.findOne({_id: req.params.userid}, function (err, user) {
        if (err) return errorProcessor(err, res);
        if (!user) return errorProcessor('User not found', res, 404);

        for (let key in req.body) {
            if (updateableProperties.indexOf(key) == -1) {
                return errorProcessor(`${key} is not a valid property`, res);
            }
        }
        user.set({firstname, lastname, username, role});
        user.save(generateCallback(req, res));
    });
}


module.exports.changePassword = function (req, res, next) {
    const {oldpassword, newpassword} = req.body;
    req.checkBody('oldpassword', 'oldpassword is required').notEmpty();
    req.checkBody('newpassword', 'newpassword is required').notEmpty();
    req.checkBody('newpassword2', 'newpassword2 is required').notEmpty();
    req.checkBody('newpassword2', 'Passwords do not match').equals(newpassword);

    var errors = req.validationErrors();
    if (errors) {
        return errorProcessor(errors.map(({msg, param}) => {
            return {msg, param}
        }), res);
    }

    User.findOne({_id: req.params.userid}, function (err, user) {
        if (err) return errorProcessor(err, res);
        if (!user) return errorProcessor('User not found', res, 404);
        if (user && user.comparePasswords(oldpassword)) {
            user['password'] = newpassword;
            user.save(generateCallback(req, res));
        } else {
            return errorProcessor('Wrong password', res);
        }
    });
}


module.exports.userCreationByAdminOrManager = function (req, res, next) {
    // As admin and manager can create new users their password should be default.
    const {
        firstname,
        lastname,
        username,
        role
    } = req.body;

    // Validation
    req.checkBody('firstname', 'Name is required').notEmpty();
    req.checkBody('username', 'Username is required').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        return errorProcessor(errors.map(({msg, param}) => {
            return {msg, param}
        }), res);
    }
    let newUser = new User({
        firstname,
        lastname,
        username,
        role,
        password: 'password'
    });

    newUser.save(function (err, user) {
        if (err) {
            return errorProcessor(err, res);
        }
        else {
            return res.json(user);
        }
    });
}