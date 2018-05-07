import React, {Component} from 'react';
import {Button, Input, Form, FormGroup, Label, Col, Container, Row} from 'reactstrap';
import {validatorRunner, nameValidator} from 'client_utils/validators';
import extractInputElementValues from 'client_utils/input-handling';
import {ProfileModel, ChangePasswordModel} from 'models/users';

export default class ProfilePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: this.props.userName,
            firstname: this.props.firstName,
            lastname: this.props.lastName
        };
        this.handleChange = this.handleChange.bind(this);
        this.onUpdateInfo = this.onUpdateInfo.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.validators = [
            nameValidator('firstname'),
            nameValidator('username'),
            nameValidator('lastname')
        ];
    }

    getUserMetaSection() {
        return (<div className="hide_overflow">
            <h4>Update personal info</h4>
            <Form onSubmit={this.onUpdateInfo}>
                <Row>
                    <Col md="5">
                        <Label for="username">User Name</Label>
                    </Col>
                    <Col>

                        <Input onChange={this.handleChange} type="text" name="username" id="username"
                               value={this.state.username}/>
                    </Col>
                </Row>
                <Row>
                    <Col md="5">
                        <Label for="firstname">First Name</Label> </Col>
                    <Col>
                        <Input onChange={this.handleChange} type="text" name="firstname" id="firstname"
                               value={this.state.firstname}/>
                    </Col>
                </Row>
                <Row>
                    <Col md="5">
                        <Label for="lastname">Last Name</Label></Col>
                    <Col>
                        <Input onChange={this.handleChange} type="text" name="lastname" id="lastname"
                               value={this.state.lastname}/>
                    </Col>
                </Row>
                <Button className="pull_right">Update</Button>
            </Form>

        </div>)
    }

    getPasswordSection() {
        return (<div>
            <h4>Change Password</h4>
            <Form onSubmit={this.onChangePassword}>
                <Row>
                    <Col md="5">
                        <Label for="oldpassword">Old Password</Label> </Col>
                    <Col>
                        <Input onChange={this.handleChange} type="password" name="oldpassword" id="oldpassword"
                               value={this.state.oldpassword}/>
                    </Col> </Row>
                <Row>
                    <Col md="5">
                        <Label for="newpassword">New Password</Label></Col>
                    <Col>
                        <Input onChange={this.handleChange} type="password" name="newpassword" id="newpassword"
                               value={this.state.newpassword}/>
                    </Col></Row>

                <Row>
                    <Col md="5">
                        <Label for="newpassword2">Re enter password</Label></Col>
                    <Col>
                        <Input onChange={this.handleChange} type="password" name="newpassword2" id="newpassword2"
                               value={this.state.newpassword2}/>
                    </Col>
                </Row>
                <Button className="pull_right">Change</Button>
            </Form>

        </div>)
    }

    onUpdateInfo(e) {
        e.preventDefault();
        const values = extractInputElementValues(e);
        this.patchUserInfo(values);
    }

    patchUserInfo(values) {
        values.userid = this.props.userId;
        let newProfile = new ProfileModel({values});
        newProfile.patch().then((payload) => {
            this.props.userLogout();
            window.showToast("Details Updated", "Your details have been updated. Please login again.", 'success');
            this.props.history.push('/login');
        });
    }

    onChangePassword(e) {
        e.preventDefault();
        const values = extractInputElementValues(e);
        this.changePassword(values);
    }

    changePassword(values) {
        values.userid = this.props.userId;
        let newPassword = new ChangePasswordModel({values});
        newPassword.post().then((payload) => {
            this.props.userLogout();
            window.showToast("Password Changed", "Your password has been updated. Please login again.", 'success');
            this.props.history.push('/login');
        });

    }

    handleChange(e) {
        let {name, value} = e.target;
        this.setState({
            [name]: value
        });
        this.setState((newState) => {
            this.runValidators(newState);
            return newState;
        });
    }

    runValidators(state) {
        return validatorRunner(this.validators, state, this.state);
    }

    render() {
        return <div className="full__width profile__page__containers">
            {this.getUserMetaSection()}
            {this.getPasswordSection()}
        </div>;
    }

}

