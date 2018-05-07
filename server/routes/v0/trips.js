const Trip = require('models/trip'),
    {errorProcessor} = require('server_utils/error');

function generateCallback(req, res) {
    return function (err, trip) {
        if (err) {
            return errorProcessor(err, res);
        }
        else {
            return res.json(trip);
        }
    }
}

module.exports.getAllTripsForAUser = function (req, res, next) {
    let queryObj = Trip.getQueryObject(req);
    Trip.find(queryObj).sort({starts: 1}).exec((err, trips) => {
        if (err) return errorProcessor(err, res);
        return res.json(trips);
    });

}

module.exports.addTripForUser = function (req, res, next) {
    const {
        starts,
        ends,
        destination,
        comment
    } = req.body;
    const userid = req.params.userid;

    let newTrip = new Trip({
        starts,
        ends,
        destination,
        comment,
        userid
    });
    newTrip.save(generateCallback(req, res));
}

module.exports.deleteTripForUser = function (req, res, next) {
    Trip.findOne({_id: req.params.tripid, userid: req.params.userid}, 'tripid', function (err, trip) {
        if (err) return errorProcessor(err, res);
        if (trip) {
            let tripId = trip.get('tripid');
            Trip.deleteOne({_id: tripId}).then((result) => {
                if (result.deletedCount == 1) {
                    return res.json({msg:`Successfully deleted: ${tripId}`, isDeleted: true, id: tripId});
                } else {
                    next();
                }
            });
        } else {
            return errorProcessor('Trip Not Found, Please check the tripid and userid in url', res, 404);
        }
    });
}

module.exports.updateTripOfUser = function (req, res, next) {

    // make sure that given trip maps to the given userid
    Trip.findOne({_id: req.params.tripid, userid: req.params.userid}, function (err, trip) {
        if (err) return errorProcessor(err, res);
        if (trip) {
            delete req.body['userid'];
            delete req.body['tripid'];
            for (let key in req.body) {
                if (trip.schema.obj.hasOwnProperty(key) || trip.schema.virtualpath(key)) {
                    trip[key] = req.body[key];
                } else {
                    return errorProcessor(`${key} is not a valid property`, res);
                }

            }
            trip.save(generateCallback(req, res));
        } else {
            return errorProcessor('Trip Not Found, Please check the tripid and userid in url', res, 404);
        }

    });

}