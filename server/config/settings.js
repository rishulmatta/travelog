const conf = {
    "port": 5000,
    "mongoose": {
        "uri": "mongodb://localhost/travelog",
        "options": {
            "server": {
                "auto_reconnect": false,
                "socketOptions": {
                    "keepAlive": 1
                }
            }
        }
    },
    "session": {
        key: 'user_session_id',
        resave: true,
        saveUninitialized: false,
        secret: "1df54#$%",
        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000
        },

    },
    "security": {
        "tokenLife": 3600
    },
    "errorFormatter": function (param, msg, value) {
        var namespace = param.split('.')
            , root = namespace.shift()
            , formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}

module.exports = conf;