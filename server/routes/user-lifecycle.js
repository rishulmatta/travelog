const express = require('express'),
    router = express.Router(),
    {validateUserRegistration, validateLogIn} = require('server_utils/user-input-validators'),
    auth = require('routes/v0/auth');


router.post('/register', validateUserRegistration, auth.register);

router.post('/login', validateLogIn, auth.logIn);

router.post('/logout', auth.logout);

router.post('/isloggedin', auth.isLoggedIn);

module.exports = router