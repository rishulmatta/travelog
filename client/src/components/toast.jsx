import React, {Component} from 'react';
import {Alert} from 'reactstrap';

const defaultState = {
    isOpen: false,
    msg: '',
    heading: '',
    status: 'error'
};

export default class Toast extends Component {
    constructor(props) {
        super(props);
        this.state = defaultState;
        window.showToast = this.showToast.bind(this);
        window.hideToast = this.hideToast.bind(this);
    }

    showToast(heading, msg, status = 'error') {
        clearTimeout(this.timer);
        this.setState({
            isOpen: true,
            msg,
            heading,
            status
        });
    }

    hideToast() {
        this.setState(defaultState);
    }

    getSuccessToast() {
        return (<Alert color="success">
            <h4 className="alert-heading">{this.state.heading}</h4>
            <p className="mb-0">
                {this.state.msg}
            </p>
        </Alert>);
    }

    getErrorToast() {
        return (<Alert color="danger">
            <h4 className="alert-heading">{this.state.heading}</h4>
            <p className="mb-0">
                {this.state.msg}
            </p>
        </Alert>);
    }

    getInfoToast() {
        return (<Alert color="info">
            <h4 className="alert-heading">{this.state.heading}</h4>
            <p className="mb-0">
                {this.state.msg}
            </p>
        </Alert>);
    }

    getToast() {
        switch (this.state.status) {
            case 'success':
                return this.getSuccessToast();
            case 'info':
                return this.getInfoToast();
            case 'error':
                return this.getErrorToast();
        }
    }

    render() {
        if (this.state.isOpen == true) {
            this.timer = setTimeout(this.hideToast.bind(this), 4000);
        }
        return <div className={this.state.isOpen ?
            "universal__toast__continaer" : "universal__toast__continaer hidden"}>
            {this.getToast()}</div>;


    }
}