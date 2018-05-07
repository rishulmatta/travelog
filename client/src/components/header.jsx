import React, {Component} from 'react';
import {
    Navbar,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink
} from 'reactstrap';
import {LoginRegisterContainer} from 'components/login-register'
import {
  Link
} from 'react-router-dom'

class Header extends Component {
    getContent() {
        if (this.props.isLoggedIn === false) {
            return (
                <LoginRegisterContainer userRegister={this.props.userRegister}/>
            );
        } else {
            if (this.props.isLoggedIn === true) {
                return ( <div>
                    {this.props.userRole !== 'user' ? <span><Link to={`/users`}>View Users</Link> | </span>: <div></div> }
                    <Link to={`/mytrips/${this.props.userName}/${this.props.userId}/trips`}>View My trips</Link> |
                    <Link to={`/profile`}>Profile</Link> |
                    <Link to="/" onClick={this.props.userLogout}>Logout</Link>

                </div>);
            } else {
                return <div></div>
            }
        }
    }

    render() {
        return (
            <Navbar>
                <Link to="/">Travelog</Link>
                <Nav>
                    <NavItem>
                        {this.getContent()}
                    </NavItem>
                </Nav>
            </Navbar>
        );
    }

    openModal() {

    }
}

export default Header;