const axios = require('axios');

/*
* AS the number of fields are very less for this application
* hence we are not sending the fields array to the api.
* */
class BaseApiModel {
    constructor(options) {
        this.host = window.location.origin;
        this.version = options.version || "v0";
        this.resourceEndPoint = options.resourceEndPoint;
        this.body = options.body;
        this.values = options.values || {};
        this.errorHandler = options.errorHandler || function (error) {
            const heading = error.response.statusText;
            let msg;
            let i = 0;
            try {
                if (error.response.data.msg.length > 0) {
                    msg = error.response.data.msg.reduce((a, b) => {
                        return {msg: `${a.msg} ${b.msg}`}
                    }).msg;
                }
                if (!msg) {

                    msg = error.response.data.msg.toString();
                }

            } catch (e) {
                msg = error.response.data;
            }


            window.showToast(heading, msg);
        };
    }

    get(key) {
        return this.values[key];
    }

    set(key, value) {
        this.values[key] = value;

    }

    getCompleteEndpoint() {
        let url = `${this.host}/api/${this.version}/${this.resourceEndPoint}`;
        return url;
    }

    fetch() {
        return this.promiseGenerator(axios.get);
    }

    post() {
        return this.promiseGenerator(axios.post);
    }

    delete() {
        return this.promiseGenerator(axios.delete);
    }

    getValues() {
        return this.values;
    }

    patch() {
        return this.promiseGenerator(axios.patch);
    }

    put() {
        return this.promiseGenerator(axios.put);
    }

    parse(payload) {
        return payload;
    }

    promiseGenerator(httpMethod) {
        const promise = new Promise(function (resolve, reject) {
            httpMethod(this.getCompleteEndpoint(), this.getValues() || this.getParams())
                .then((payload) => resolve(this.parse(payload)))
                .catch((error) => {
                    this.errorHandler(error);
                    reject(error);
                });
        }.bind(this));
        return promise;
    }
}

export default BaseApiModel;