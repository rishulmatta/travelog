const roleValidators = require('server_utils/role-validator'),
    {resFactory} = require('test/helpers/response-factory'),
    utils = require('server_utils/error'),
    {requestFactory} = require('test/helpers/request-factory');


describe('onlySelf', () => {

    it('should pass for loggedIn user/admin/manager accessing own record', () => {

        ['user', 'admin', 'manager'].forEach((role) => {
            let req = requestFactory('self', role);
            let next = jest.fn();
            let res = jest.fn();
            roleValidators.onlySelf(req, res, next);
            expect(next).toHaveBeenCalledTimes(1);
            expect(res).toHaveBeenCalledTimes(0);
        });

    });

    it('should fail for loggedIn user/admin/manager accessing other\'s record', () => {

        ['user', 'admin', 'manager'].forEach((role) => {
            let req = requestFactory('diff', role);
            let next = jest.fn();
            let res = resFactory();
            utils.errorProcessor = jest.fn();
            let return_val = roleValidators.onlySelf(req, res, next);
            expect(next).toHaveBeenCalledTimes(0);
            expect(utils.errorProcessor).toHaveBeenCalledTimes(1);
            expect(return_val).not.toBe(true);
        });

    });
});


describe('onlyAdminAndManager', () => {

    it('should allow admin and manager even as they access diff\'s record', () => {
        ['manager', 'admin'].forEach((role) => {
            let req = requestFactory('diff', role);
            let next = jest.fn();
            let res = jest.fn();
            roleValidators.onlyAdminAndManager(req, res, next);
            expect(next).toHaveBeenCalledTimes(1);
            expect(res).toHaveBeenCalledTimes(0);
        });
    });

    it('should block loggedin user even for self records', () => {
        let req = requestFactory('self', 'user');
        let next = jest.fn();
        let return_val = roleValidators.onlyAdminAndManager(req, {}, next);
        expect(return_val).not.toBe(true);
        expect(next).toHaveBeenCalledTimes(0);
    });
});

describe('userAccessSelfExceptAdminManager', () => {
    it('should allow user accessing own record', () => {
        let req = requestFactory('self', 'user');
        let next = jest.fn();
        roleValidators.userAccessSelfExceptAdminManager(req, {}, next);
        expect(next).toHaveBeenCalledTimes(1);
    });

    it('should block user accessing diff record', () => {
        let req = requestFactory('diff', 'user');
        utils.errorProcessor = jest.fn();
        let return_val = roleValidators.userAccessSelfExceptAdminManager(req, {}, {});
        expect(return_val).not.toBe(true);
        expect(utils.errorProcessor).toHaveBeenCalledTimes(1);
    });

    it('should allow admin/manager accessing own record', () => {

        ['manager', 'admin'].forEach((role) => {
            let req = requestFactory('self', role);
            let next = jest.fn();
            roleValidators.userAccessSelfExceptAdminManager(req, {}, next);
            expect(next).toHaveBeenCalledTimes(1);
        });

    });

    it('should allow admin/manager accessing diff record', () => {
        ['manager', 'admin'].forEach((role) => {
            let req = requestFactory('diff', role);
            let next = jest.fn();
            utils.errorProcessor = jest.fn();
            roleValidators.userAccessSelfExceptAdminManager(req, {}, next);
            expect(next).toHaveBeenCalledTimes(1);
            expect(utils.errorProcessor).toHaveBeenCalledTimes(0);
        });

    });
});

describe('allPassForAdmin', () => {
    it('should block manager/user accessing diff record', () => {
        ['user', 'manager'].forEach((role) => {
            let req = requestFactory('diff', role);
            let next = jest.fn();
            let res = resFactory();
            utils.errorProcessor = jest.fn();
            let return_val = roleValidators.allPassForAdmin(req, res, next);
            expect(next).toHaveBeenCalledTimes(0);
            expect(utils.errorProcessor).toHaveBeenCalledTimes(1);
            expect(return_val).not.toBe(true);
        });
    });

    it('should allow user/admin/manager accessing self record', () => {
        ['manager', 'admin', 'admin'].forEach((role) => {
            let req = requestFactory('self', role);
            let next = jest.fn();
            utils.errorProcessor = jest.fn();
            roleValidators.allPassForAdmin(req, {}, next);
            expect(next).toHaveBeenCalledTimes(1);
            expect(utils.errorProcessor).toHaveBeenCalledTimes(0);
        });
    });

    it('should allow admin accessing diff record', () => {

            let req = requestFactory('diff', 'admin');
            let next = jest.fn();
            utils.errorProcessor = jest.fn();
            roleValidators.allPassForAdmin(req, {}, next);
            expect(next).toHaveBeenCalledTimes(1);
            expect(utils.errorProcessor).toHaveBeenCalledTimes(0);
        });

});
