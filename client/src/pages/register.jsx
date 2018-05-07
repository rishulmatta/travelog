import React, {Component} from 'react';
import {Button, Input, Form, FormGroup, Label, Col} from 'reactstrap';
import {Register as RegisterModel} from 'models/auth'
import extractInputElementValues from 'client_utils/input-handling';
import {validatorRunner} from 'client_utils/validators';
import {
    nameValidator
} from 'client_utils/validators'

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.userRegister = this.userRegister.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.validators = [
            nameValidator('firstname'),
            nameValidator('username'),
            nameValidator('lastname')
        ];
    }

    userRegister(values) {
        let registerModel = new RegisterModel({values});

        registerModel.post().then((payload) => {
            this.props.history.push('/login');
            window.showToast("Successfully Registered", "Please login with your username", 'success');
        });
    }

    runValidators(state) {
        return validatorRunner(this.validators, state, this.state);
    }

    handleChange(e) {
        let {name, value} = e.target;
        this.setState({
            [name]: value
        }, this.runValidators);
    }


    onFormSubmit(e) {
        e.preventDefault();
        if (this.runValidators(this.state)) {
            const values = extractInputElementValues(e);
            this.userRegister(values);
        }

    }

    render() {
        return (
            <Form onSubmit={this.onFormSubmit}>
                {['First Name', 'Last Name', 'User Name'].map(name => {
                    let elementName = name.toLowerCase().replace(" ", "");
                    return <FormGroup row>
                        <Label for={elementName} sm={4}>{name}</Label>
                        <Col sm={8}>
                            <Input onChange={this.handleChange} type="text" name={elementName} id={elementName}
                                   placeholder={name}/>
                        </Col>
                    </FormGroup>
                })}

                <FormGroup row>
                    <Label for="password" sm={4}>Password</Label>
                    <Col sm={8}>
                        <Input onChange={this.handleChange} type="password" name="password" id="password"
                               placeholder="password"/>
                    </Col>
                </FormGroup>

                <FormGroup row>
                    <Label for="password2" sm={4}>Re-enter Password</Label>
                    <Col sm={8}>
                        <Input onChange={this.handleChange} type="password" name="password2" id="password2"
                               placeholder="password"/>
                    </Col>
                </FormGroup>


                <FormGroup check row>
                    <Col sm={{size: 2, offset: 9}}>
                        <Button>Register</Button>
                    </Col>
                </FormGroup>
            </Form>
        );
    }
}

export default Register;