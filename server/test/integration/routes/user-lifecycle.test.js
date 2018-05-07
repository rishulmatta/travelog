const request = require('supertest');
const app = require('config/app');


describe('resources/', () => {
    it('should fail for non logged in user', () => {
        return request(app).get("/api/v0/resources/users").then(response => {
            expect(response.statusCode).toBe(401)
        })
    });
});

describe('auth/isLoggedIn', () => {
    it('should fail for non logged in user with a false', () => {
        return request(app).post("/api/v0/auth/isloggedin").then(response => {
            expect(response.statusCode).toBe(200);
            expect(response.body).toBe(false);
        })
    });
});

describe('auth/login', () => {
    it('should fail for non logged in user with a no username & password', () => {
        return request(app).post("/api/v0/auth/login").then(response => {
            expect(response.statusCode).toBe(400);
            expect(response.body.msg.length).toBe(2);
        })
    });

    it('should fail for non logged in user with a invalid username & password and say invalid username', () => {
        return request(app).post("/api/v0/auth/login").send({
            username: 'abc',
            password: 'xyz'
        }).then(response => {
            expect(response.statusCode).toBe(400);
            expect(response.body.msg.length).toBe(1);
        })
    });

    it('should pass for non logged in user with a valid username & password', () => {
        return request(app).post("/api/v0/auth/login").send({
            username: 'admin',
            password: 'z'
        }).then(response => {
            expect(response.statusCode).toBe(200);
            expect(response.body.msg).toBe(undefined);
            expect(response.body.userid).not.toBe(undefined);
        })
    });
});

describe('auth/register', () => {
    it('should fail for non logged in user with empty request', () => {
        return request(app).post("/api/v0/auth/register").then(response => {
            expect(response.statusCode).toBe(400);
            expect(response.body.msg.length).toBe(4);
        })
    });

    it('should fail for non logged in user with non matching passwords', () => {
        return request(app).post("/api/v0/auth/register").send({
            username: 'abc',
            firstname: 'q',
            password: 'z',
            password2: 'y'
        }).then(response => {
            expect(response.statusCode).toBe(400);
            expect(response.body.msg.length).toBe(1);
        })
    });
});