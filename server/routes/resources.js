const express = require('express'),
    users = require('routes/v0/users'),
    trips = require('routes/v0/trips'),
    {
        onlyAdminAndManager,
        userAccessSelfExceptAdminManager,
        onlySelf,
        allPassForAdmin
    } = require('server_utils/role-validator'),
    router = express.Router();


router.get('/users', onlyAdminAndManager, users.getAllUsers); // only manager and admin
router.post('/users', onlyAdminAndManager, users.userCreationByAdminOrManager); // only manager and admin,

router.get('/users/:userid', userAccessSelfExceptAdminManager, users.getUser); // make sure logged in user accessing his own data, except for manager and admin
router.delete('/users/:userid', userAccessSelfExceptAdminManager, users.deleteUser); // same as above
router.patch('/users/:userid', userAccessSelfExceptAdminManager, users.patchUser);// same as above can take names and usernames
router.put('/users/:userid', onlyAdminAndManager, users.updateUser); // can accept roles as well, admin and manager only


router.post('/users/:userid/change_password', onlySelf, users.changePassword); // user check

router.get('/users/:userid/trips', allPassForAdmin, trips.getAllTripsForAUser);// make sure logged in user accessing his own data, except for admin
router.post('/users/:userid/trips', allPassForAdmin, trips.addTripForUser);// same as above
router.delete('/users/:userid/trips/:tripid', allPassForAdmin, trips.deleteTripForUser); // same as above
router.put('/users/:userid/trips/:tripid', allPassForAdmin, trips.updateTripOfUser); // same as above

module.exports = router;