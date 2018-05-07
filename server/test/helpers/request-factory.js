
const firstUser = 123;
const secondUser = 456;

const userSessionReq = {
    session: {
        user:{
            role: "",
            firstname: "User",
            username: "UserName",
            userid: firstUser
        }
    }
}

const sameUserResource = {
    params:{
        userid: firstUser
    }
}

const differentUserResource = {
    params:{
        userid: secondUser
    }
}


function requestFactory(resAccess, role) {
    let req = {};
    switch(resAccess) {
        case 'self':
            req = Object.assign({}, userSessionReq, sameUserResource);
            break;
        case 'diff':
            req = Object.assign({}, userSessionReq, differentUserResource);
            break;
    }

    req.session.user.role = role;
    return req;
}

module.exports.requestFactory = requestFactory