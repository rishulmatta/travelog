import BaseApiModel from 'models/api_model';
import guidGenerator from 'client_utils/id-generator';

export class UsersModels extends BaseApiModel {
    constructor(options) {
        super(Object.assign({}, options, {
            resourceEndPoint: 'resources/users'
        }));

    }

    parse(payload) {
        let modelArray = payload.data.map((user) => {
            let rowModel = new UserModel({values: user, id: user.userid});
            return rowModel;
        });
        return modelArray;
    }
}

export class UserModel extends UsersModels {
    constructor(options) {
        super(Object.assign({}, options, {
            resourceEndPoint: `resources/users/${options.userId}/trips`
        }));
        if (!options.values) {
            this.isNew = true;
            this.values = this.getDefaultValues();
            this.id = guidGenerator();
        } else {
            this.isNew = false;
            this.id = options.values.userid;
        }


        this.keysToPersist = ['role', 'firstname', 'lastname', 'username'];
    }

    getDefaultValues() {
        return {
            'role': "user",
            'firstname': "",
            'lastname': "",
            'username': ""
        };
    }

    getCompleteEndpoint() {
        let url = super.getCompleteEndpoint();
        if (this.id && !this.isNew) {
            url = url.concat(`/${this.id}`);
        }
        return url;
    }

    getValues() {
        let obj = {};
        this.keysToPersist.forEach(key => obj[key] = this.get(key));

        return obj;
    }



    save() {
        if (this.isNew) {
            return super.post();
        } else {
            return super.put();
        }
    }

    del() {
        if (this.isNew) {
            return Promise.resolve(this.id);
        } else {
            return super.delete();
        }
    }

    parse(payload) {
        const data = payload.data;
        this.isNew = false;
        if (!data.isDeleted) {
            this.id = data['userid'];
            this.set('userid', this.id);
            this.keysToPersist.forEach(key => this.set(key, data[key]));
            return data;
        } else {
            return data.id;
        }

    }

}


export class ProfileModel extends BaseApiModel {
    constructor(options) {
        super(Object.assign({}, options, {
            resourceEndPoint: 'resources/users'
        }));
        this.id = options.values.userid;
         this.keysToPersist = ['firstname', 'lastname', 'username'];
    }

    getCompleteEndpoint() {
        let url = super.getCompleteEndpoint();
        if (this.id) {
            url = url.concat(`/${this.id}`);
        }
        return url;
    }

    getValues() {
        let obj = {};
        this.keysToPersist.forEach(key => obj[key] = this.get(key));

        return obj;
    }

}


export class ChangePasswordModel extends BaseApiModel {
    constructor(options) {
        super(Object.assign({}, options, {
            resourceEndPoint: 'resources/users'
        }));
        this.id = options.values.userid;
    }

    getCompleteEndpoint() {
        let url = super.getCompleteEndpoint();
        if (this.id) {
            url = url.concat(`/${this.id}/change_password`);
        }
        return url;
    }

}