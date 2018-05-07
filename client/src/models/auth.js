import BaseApiModel from 'models/api_model';

export class LoginModel extends BaseApiModel {
    constructor(options) {
        super(Object.assign({}, {
            resourceEndPoint: 'auth/login'
        }, options));

    }

    parse(payload) {
        let values = {
            isLoggedIn: false
        };
        if (payload.status === 200) {
            if (payload.data.userid) {
                Object.assign(values, payload.data, {isLoggedIn: true});
            }
        }
        return values;
    }
}

export class IsLoggedIn extends LoginModel {
    constructor(options) {
        super(Object.assign({},{
            resourceEndPoint: 'auth/isloggedin'
        }, options));

    }

    parse(payload) {
        let values = {
            isLoggedIn: false
        };
        if (payload.status === 200) {
            if (payload.data.userid) {
                Object.assign(values, payload.data, {isLoggedIn: true});
            }
        }
        return values;
    }
}

export class Register extends BaseApiModel {
    constructor(options) {
        super(Object.assign({},{
            resourceEndPoint: 'auth/register'
        }, options));

    }
}

export class Logout extends BaseApiModel {
    constructor(options) {
        super(Object.assign({}, {
            resourceEndPoint: 'auth/logout'
        }, options));

    }

    parse(payload) {
        return payload.status === 200;
    }
}
