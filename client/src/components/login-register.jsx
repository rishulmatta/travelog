import React, {Component} from 'react';
import {Link} from "react-router-dom";


export const LoginRegisterContainer = (props) => {
    return (
        <div inline="true">
            <Link to="/login">Login</Link>
            <div className="header__register-btn">
                <Link to="/register">Register</Link>
            </div>
        </div>
    );
};
