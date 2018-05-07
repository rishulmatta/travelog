import React, {Component} from 'react';
import {Container, Row, Col, Button, Input, Label} from 'reactstrap';

export class TripsTableHeader extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);

    }

    handleChange(e) {
        const {name, value} = e.target;
        this.props.onFilterChange({name, value});
    }

    render() {
        return (
            <Container className="trips__table__header">
                <Row className="trips__table__header__text">
                    <h3>Trips for {this.props.userName}</h3>
                </Row>
                <Row>
                    <Col md="5">
                        <Row>
                            Filter by :
                        </Row>
                        <Row>
                           <Input onChange={this.handleChange} type="text" name="filterdestination" id="filterdestination" placeholder="Type a destination..."/>
                        </Row>
                        <Row>
                            <div>
                                <Label for="filterstartdate">Start</Label>
                                <Input onKeyDown={(e) => e.preventDefault()} tabIndex="0" onChange={this.handleChange} type="date" name="filterstartdate" id="filterstartdate" />
                            </div>
                            <div className="trips__table__header__filter__end">
                                <Label for="filterenddate">End</Label>
                                <Input onKeyDown={(e) => e.preventDefault()} tabIndex="0" onChange={this.handleChange} type="date" name="filterenddate" id="filterenddate" />
                            </div>
                        </Row>

                    </Col>

                    <Col md={{ size: 5, offset: 2 }} className="right__align">
                        <Button outline color="primary" onClick={this.props.addRow}>Add a Trip</Button>
                    </Col>


                </Row>
            </Container>
        );
    }
}