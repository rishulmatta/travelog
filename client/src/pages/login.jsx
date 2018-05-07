import React, {Component} from 'react';
import {Button, Input, Form, FormGroup, Label, Row, Col} from 'reactstrap';
import {LoginModel} from 'models/auth'

function extractInputElementValues(e) {
    const inputElements = e.target.querySelectorAll('input');
    const values = {};
    inputElements.forEach(ele => {
        if (ele.name) {
            values[ele.name] = ele.value
        }
    });

    return values;
}

export class Login extends Component {
    constructor(props) {
        super(props);
        this.login = this.login.bind(this);
    }

    login(e) {
        e.preventDefault();
        const values = extractInputElementValues(e);

        let login = new LoginModel({values});
        login.post().then((userValues) => {
            this.props.userLogin(userValues);
            this.props.history.push('/profile');
        });

    }

    render() {
        return (
            <Form onSubmit={this.login}>
                <FormGroup>
                    <Row>
                        <Col md="5">
                            <Label for="username">User Name</Label>
                        </Col>
                        <Col>

                            <Input type="text" name="username" id="username" placeholder="User Name"/>
                        </Col>
                    </Row>


                </FormGroup>
                <FormGroup>
                    <Row>
                    <Col md="5">
                        <Label for="password"> Password
                        </Label>
                    </Col>
                    <Col>
                        <Input type="password" name="password" id="password"/>
                    </Col>
                    </Row>

                </FormGroup>
                <Button color="primary" className="pull_right">Login</Button>

            </Form>

        );
    }
}


export default Login;