class ParentError extends Error {
    constructor(status, msg) {
        super(msg);
        if (typeof msg == 'string') {
            msg = [msg];
        }
        this.status = status || 500;
        this.msg = msg;
    }

    toJSON() {
        return {msg: this.msg}
    }
}

class RegistrationError extends ParentError {
    constructor(msg) {
        super(400, msg);
    }
}

function errorProcessor(err, res, status) {

    if (err &&  ['MongoError'].indexOf(err.name) != -1) {
        return processMongoError(err, res);
    } else {
        return processNodeError(err, res, status);
    }
}

function processNodeError(err, res, status) {

    if (err instanceof Error) {
        err = err.message;
    }
    let nodeError = new ParentError(status || 400, err);
    return res.status(nodeError.status).json(nodeError);


}

function processMongoError(err, res) {
    const code = err.code;
    let dbError;
    switch (code) {
        case 11000:
            dbError = new RegistrationError('Userame is already taken');
            break;
        default:
            dbError = new ParentError(500, dbError.errmsg);
            break;
    }
    res.status(dbError.status).json(dbError);

    return res;
}

module.exports.errorProcessor = errorProcessor;
