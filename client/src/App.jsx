import React, {Component} from 'react';
import {HashRouter, Route, Redirect} from 'react-router-dom';
import {Container, Row, Col} from 'reactstrap';
import {LoginModel, Logout, IsLoggedIn} from 'models/auth'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'css/open-iconic-bootstrap.css';
import 'css/App.css';
import Header from 'components/header';
import Toast from 'components/toast'
import Home from 'pages/home';
import TripsPage from 'pages/trips';
import UsersPage from 'pages/users';
import ProfilePage from 'pages/profile';
import RegisterPage from 'pages/register';
import Login from 'pages/login'


const defaultState = {
    isLoggedIn: null,
    role: null,
    firstname: null,
    secondname: null,
    username: null,
    userid: null
};

class App extends Component {
    constructor(props) {
        super(props);

        this.state = defaultState

        this.userLogin = this.userLogin.bind(this);
        this.userLogout = this.userLogout.bind(this);
    }


    componentDidMount() {
        // verify that user session is still valid on server.
        this.isLoggedIn();
    }

    isLoggedIn() {
        let isLoggedIn = new IsLoggedIn();
        isLoggedIn.post().then((userValues) => {
            this.setState(userValues);
        });
    }

    userLogin(values = {}) {
        this.setState(values);
    }


    userLogout() {
        let logoutModel = new Logout();

        logoutModel.post().then((isSuccess) => {
            if (isSuccess) {
                this.setState(Object.assign(defaultState, {isLoggedIn: false}));
            }
        });
    }


    render() {
        return (

            <HashRouter>
                <div>
                    <Header
                        userRole={this.state.role}
                        isLoggedIn={this.state.isLoggedIn}

                            userLogout={this.userLogout}
                            userId={this.state.userid}
                            userName={this.state.username}/>

                    <Container>
                            <Route exact path="/" component={Home}/>

                        <Route exact path="/login" render={(props) => <Login userLogin={this.userLogin} {...props}></Login>}/>

                            <Route exact path="/register"
                                   component={RegisterPage}

                            />

                            <Route exact path="/profile"
                                   render={(props) => {
                                       if (!this.state.firstname) {
                                           return <div></div>
                                       } else {
                                           return <ProfilePage {...props}
                                                               firstName={this.state.firstname}
                                                               lastName={this.state.lastname}
                                                               userName={this.state.username}
                                                               userId={this.state.userid}
                                                               userLogout={this.userLogout}
                                           />
                                       }
                                   }}/>

                            <Route exact path="/users"
                                   render={(props) =>
                                       <UsersPage {...props} userRole={this.state.role}/>}/>

                            <Route exact path="/users/:userName/:userId/trips" component={TripsPage}/>
                            <Route exact path="/mytrips/:userName/:userId/trips" component={TripsPage}/>


                    </Container>
                    <Toast></Toast>
                </div>
            </HashRouter>

        )
    }

}

export default App;
