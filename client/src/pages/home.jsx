import React, {Component} from 'react';
import {Jumbotron, Container} from 'reactstrap';

class Home extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <Jumbotron fluid>
            <Container fluid>
                <h1 className="display-3">Travelog</h1>
                <p className="lead">Where great trips begin...</p>
            </Container>
        </Jumbotron>
    }

}

export default Home;