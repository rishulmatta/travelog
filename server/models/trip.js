const mongoose = require('mongoose');

const queryParamToColMap = {
    'filterdestination': 'destination',
    'filterstartdate': 'starts',
    'filterenddate': 'ends'
};

const TripSchema = mongoose.Schema({
    starts: {
        type: Date
    },
    ends: {
        type: Date
    },
    created: {
        type: Date,
        default: Date.now
    },
    destination: {
        type: String,
        minlength: 3,
        maxlength: 255,
        required: true
    },
    comment: {
        type: String,
        minlength: 0,
        maxlength: 1000,
    },
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});
TripSchema.virtual('tripid')
    .get(function () {
        return this._id.toString();
    });

TripSchema.pre("save", function(next) {
    if (this.starts > this.ends) {
        next(new Error('Ending date cannot be less than start date'));
    }
    next();
});

TripSchema.options.toJSON = {
    transform: function (doc, jsonObj, options) {
        const {tripid, starts, ends, destination, comment, userid} = doc;
        return {tripid, starts, ends, destination, comment, userid};
    }
};

TripSchema.statics.getQueryObject = function (req) {
    let query = {
        userid: req.params.userid
    };
    if (!req.query) {
        return query;
    }
    const {filterdestination, filterstartdate, filterenddate} = req.query;

    if (filterdestination) {
        query[queryParamToColMap['filterdestination']] = new RegExp(`^${filterdestination}.*`, "i");
    }

    if (filterstartdate) {
        query[queryParamToColMap['filterstartdate']] = {$gte: filterstartdate};
    }

    if (filterenddate) {
        query[queryParamToColMap['filterenddate']] = {$lte: filterenddate};
    }

    return query;
};



/*
* _If you want to update a single document in the db and return it to your application, use findOneAndUpdate instead._
* */
const TripModel = mongoose.model('Trip', TripSchema);
module.exports = TripModel;
