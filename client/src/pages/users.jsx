import React, {Component} from 'react';
import {
    UsersModels,
    UserModel
} from 'models/users';
import {Table, Button, Container, Row, Col} from 'reactstrap';
import {EditableRowUsers} from 'components/editable-row';
import {
    nameValidator,
    optionalNameValidator
} from 'client_utils/validators'

class UsersPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: []
        };

        this.removeRow = this.removeRow.bind(this);
        this.addRow = this.addRow.bind(this);
    }

    getValidators() {
        return [
            nameValidator('username'),
            nameValidator('firstname'),
            optionalNameValidator('lastname')
        ]
    }

    componentDidMount() {
        let usersModel = new UsersModels();
        usersModel.fetch().then((data) => {
            this.setState({rows: data});
        });
    }

    addRow() {
        let row = new UserModel({});
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
            return "No Users in the application";
        }


        let tableRows = this.state.rows.map((row, index) => {
            row.set('index', index+1);
            return (
                <EditableRowUsers
                    key={row.id}
                    role={this.props.userRole}
                    onRemoveRow={this.removeRow}
                    edit={row.isNew}
                    model={row}
                    editableVals={['username', 'firstname', 'lastname', 'role']}
                    derivedProperties={[]}
                    editableValType={['text', 'text', 'text', 'select']}
                    selectOptions={{role: ['user', 'manager', 'admin']}}
                    validators={this.getValidators()}
                    values={["index", 'username', 'firstname', 'lastname', 'role']}/>);
        });

        return tableRows;

    }

    render() {
        return (
            <Container className="trips__table__header">
                <Row>
                    <Col md={{ size: 2, offset: 10 }} className="right__align">
                     <Button outline color="primary" onClick={this.addRow}>Add a User</Button>
                    </Col>
                </Row>
                <Table striped>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>UserName</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody className="trips__table__body">
                        {this.getTableBody()}
                    </tbody>
                </Table>
            </Container>
        );
    }

}

export default UsersPage;