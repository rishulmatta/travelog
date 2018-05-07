import React, {Component} from 'react';
import {
    TripsModel,
    Trip
} from 'models/trips';
import {Table, Button} from 'reactstrap';
import {EditableRow} from 'components/editable-row';
import {computeDaysRemaining, isEndGreaterStart} from 'client_utils/date-calculations';
import {
    nameValidator,
    optionalNameValidator,
    optionalWithSpaceValidator,
    dependentValidations
} from 'client_utils/validators'
import _ from 'lodash';

import {TripsTableHeader} from 'components/trips/table-header';

class TripsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: [],
            filters: {}
        };

        this.removeRow = this.removeRow.bind(this);
        this.addRow = this.addRow.bind(this);
        this.onFilterChange = this.onFilterChange.bind(this);
        this.fetchTrips = _.throttle(this.fetchTrips.bind(this), 300);

    }

    getValidators() {
        return [
            optionalWithSpaceValidator('destination'),
            optionalWithSpaceValidator('comment'),
            dependentValidations('ends', 'starts', 'End date must be greater than Start date', isEndGreaterStart)
        ]
    }

    fetchTrips() {
        let tripsModel = new TripsModel({
            userId: this.props.match.params.userId,
            filters: this.state.filters
        });
        tripsModel.fetch().then((data) => {
            this.setState({rows: data});
        });
    }

    componentDidMount() {
        this.fetchTrips();
    }

    addRow() {
        let row = new Trip({
            userId: this.props.match.params.userId
        });
        let newRows = this.state.rows.slice();
        newRows.unshift(row);
        this.setState({rows: newRows});
    }

    removeRow(rowId) {
        let filteredRows = this.state.rows.filter(row => row.id != rowId);
        this.setState({rows: filteredRows});
    }

    getTableBody() {
        if (this.state.rows.length == 0) {
            return "Sorry you have no trips";
        }


        let tableRows = this.state.rows.map((row, index) => {
            row.set('index', index + 1);
            return (
                <EditableRow
                    key={row.id}
                    onRemoveRow={this.removeRow}
                    edit={row.isNew}
                    model={row}
                    editableVals={['destination', 'starts', 'ends', 'comment']}
                    derivedProperties={[{
                        name: 'daysRemaining',
                        dependsOn: 'starts',
                        calc: computeDaysRemaining
                    }]}
                    editableValType={['text', 'date', 'date', 'text']}
                    validators={this.getValidators()}
                    values={["index", 'destination', 'starts', 'ends', 'daysRemaining', 'comment']}/>);
        });

        return tableRows;

    }

    onFilterChange({name, value}) {
        this.setState((prevState) => {
                return Object.assign(prevState.filters, {[name]: value});
            }
            , this.fetchTrips);
    }

    render() {
        return (
            <div className="full__width">
                <TripsTableHeader
                    userName={this.props.match.params.userName}
                    addRow={this.addRow}
                    onFilterChange={this.onFilterChange}
                ></TripsTableHeader>
                <Table striped>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Destination</th>
                        <th>Start</th>
                        <th>End</th>
                        <th>Remaining Days</th>
                        <th>Comment</th>
                        <th className="trips__table__actions">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="trips__table__body">
                    {this.getTableBody()}
                    </tbody>
                </Table>
            </div>
        );
    }

}

export default TripsPage;