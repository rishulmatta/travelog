const mongoose = require('mongoose'),
    async = require('async'),
    crypto = require('crypto');


const UserSchema = mongoose.Schema({
    created: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        enum : ["user", "manager", "admin"],
        default: "user"
    },
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    encodedpassword: {
        type: String
    },
    salt: {
        type: String
    }
});

UserSchema.virtual('userid')
    .get(function () {
        return this._id.toString();
    });

UserSchema.virtual('password')
    .set(function (password) {
        this._plainPassword = password;
        this.salt = Math.random();
        this.encodedpassword = this.encodePassword(password);
    })
    .get(function () {
        return this._plainPassword;
    });

UserSchema.methods.encodePassword = function (password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};


UserSchema.methods.comparePasswords = function (password) {
    return this.encodePassword(password) === this.encodedpassword;
};

UserSchema.statics.authorize = function (username, password, finalCallBack) {
  var User = this;

    async.waterfall([
      function (callback) {
        User.findOne({username: username}, callback);
      },
      function (user, callback) {
        if (!user) {
            return callback('Wrong username');
        }
        if (user && user.comparePasswords(password)) {
          callback(null, user);
        } else {
          callback('Wrong password');
        }
      }
    ], finalCallBack);

};

UserSchema.options.toJSON = {
    transform: function (doc, jsonObj, options) {
        const {userid, firstname, lastname, username, role} = doc;
        return {userid, firstname, lastname, username, role};
    }
};

const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel