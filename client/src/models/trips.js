import BaseApiModel from 'models/api_model';
import guidGenerator from 'client_utils/id-generator';
import dateFormatter, {computeDaysRemaining} from 'client_utils/date-calculations';

export class TripsModel extends BaseApiModel {
    constructor(options) {
        super(Object.assign({}, options, {
            resourceEndPoint: `resources/users/${options.userId}/trips`
        }));
        this.params = options.filters;
    }

    parse(payload) {
        let modelArray = payload.data.map((trip) => {
            let rowModel = new Trip({values: trip, userId: trip.userid});
            return rowModel;
        });
        return modelArray;
    }

    getValues() {
        // this will be user only for get
    }

    getParams() {
        return {
            params: this.params
        }
    }

}

export class Trip extends TripsModel {
    constructor(options) {
        super(Object.assign({}, options));

        if (!options.values) {
            this.isNew = true;
            this.values = this.getDefaultValues();
            // we use tripids as row ids , but new rows dont have any
            this.id = guidGenerator();
        } else {
            this.id = options.values.tripid;
            this.isNew = false;
        }
        this.populateModel();
        this.keysToPersist = ['destination', 'starts', 'ends', 'comment'];
    }

    getDefaultValues() {
        return {
            'destination': "",
            'starts': dateFormatter(new Date()),
            'ends': dateFormatter(new Date().setDate(new Date().getDate() + 2)),
            'comment': ""
        };
    }

    populateModel() {
        this.computeValues();
        this.formatValues();
    }


    formatValues() {
        this.values['starts'] = dateFormatter(this.values['starts']);
        this.values['ends'] = dateFormatter(this.values['ends']);
    }

    computeValues() {
        this.computeDaysRemaining();
    }

    computeDaysRemaining() {
        let presentDate = new Date();
        let startDate = new Date(this.values['starts']);
        this.values['daysRemaining'] = computeDaysRemaining(startDate, presentDate);

    }

    getCompleteEndpoint() {
        let url = super.getCompleteEndpoint();
        if (this.id && !this.isNew) {
            url = url.concat(`/${this.id}`);
        }
        return url;
    }

    get(key) {
        return this.values[key];
    }

    set(key, value) {
        this.values[key] = value;

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
            this.id = data['tripid'];
            this.keysToPersist.forEach(key => this.set(key, data[key]));
            this.populateModel();
        } else {
            return data.id;
        }

    }
}

