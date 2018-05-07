const utils = require('server_utils/error');

const MANAGER = 'manager';
const USER = 'user';
const ADMIN = 'admin';

const roleValidatorGenerator = (roleHandlerMap) => {
    return (req, res, next) => {
        if (!req.session.user) {
            return utils.errorProcessor('Please login.', res, 401);
        }
        let userRole = req.session.user.role;
        let handler = roleHandlerMap[userRole];

        if (!userRole || !handler) {
            return utils.errorProcessor('Please logout and login. Couldnt recognize your role', res, 403);
        }

        let returnVal = handler(req, res, userRole);
        if (returnVal !== true) {
            return returnVal;
        }
        next();
    }
};

const letAllPass = () => true;

const blockAndRespond = (req, res, role) =>
    utils.errorProcessor(`Your role: ${role}. You\'re not authorized to access this functionality`, res, 403);

const validateUserAccessingSelf = (req, res, role) => {
    if (req.session.user.userid !== req.params.userid) {
        return utils.errorProcessor(`Your role: ${role}. You\'re not authorized to access the records of other users.`, res, 403);
    }
    return true;
};


module.exports.onlyAdminAndManager = roleValidatorGenerator({
    [ADMIN]: letAllPass,
    [MANAGER]: letAllPass,
    [USER]: blockAndRespond
});

module.exports.userAccessSelfExceptAdminManager = roleValidatorGenerator({
    [ADMIN]: letAllPass,
    [MANAGER]: letAllPass,
    [USER]: validateUserAccessingSelf
});

// used in password change path.
module.exports.onlySelf = roleValidatorGenerator({
    [ADMIN]: validateUserAccessingSelf,
    [MANAGER]: validateUserAccessingSelf,
    [USER]: validateUserAccessingSelf
});

module.exports.allPassForAdmin = roleValidatorGenerator({
    [ADMIN]: letAllPass,
    [MANAGER]: validateUserAccessingSelf,
    [USER]: validateUserAccessingSelf
});