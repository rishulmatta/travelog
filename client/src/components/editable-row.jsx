import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {validatorRunner} from 'client_utils/validators';

export class EditableRow extends Component {
    constructor(props) {
        super(props);

        let defaultState = this.getDefaultState();
        let derivedProps = this.processDeriveProperties(defaultState);
        this.state = Object.assign({
            edit: this.props.edit,
        }, defaultState, derivedProps);
        this.methodBindings();
    }

    methodBindings() {
        this.editToggle = this.editToggle.bind(this);
        this.saveRow = this.saveRow.bind(this);
        this.deleteRow = this.deleteRow.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onSaveCallBack = this.onSaveCallBack.bind(this);
    }

    getDefaultState() {
        let obj = {};
        this.props.values.forEach((key) => obj[key] = this.props.model.get(key));
        return obj;
    }

    runValidators(state) {
        return validatorRunner(this.props.validators, state, this.state);
    }

    processDeriveProperties(previousState) {
        if (this.props.derivedProperties.length > 0) {
            return this.props.derivedProperties.map(obj => {
                const {name, dependsOn, calc} = obj;
                let valueOfParent = previousState[dependsOn];
                let computedValue = calc(valueOfParent);
                return {
                    [name]: computedValue
                }
            }).reduce((a, b) => Object.assign({}, a, b));
        } else {
            return {};
        }

    }

    editToggle() {
        let edit = this.state.edit;
        this.setState({edit: !edit});
        this.props.model.set('edit', edit);
    }

    getViewModeCell(key, index) {
        return <td key={index}>{this.props.model.get(key)}</td>;
    }

    getViewMode() {
        return (<tr className="view">
            {this.props.values.map((key, index) => {
                return this.getViewModeCell(key, index)
            })}
            <td className="trips__table__actions">
                <span title="Edit" className="oi oi-pencil" onClick={this.editToggle}></span>
                <span title="Delete" className="oi oi-trash" onClick={this.deleteRow}></span>
            </td>
        </tr>);
    }

    getDateControl(key) {
        return (<input name={key}
                       onChange={this.handleChange}
                       type='date'
                       value={this.state[key]} onKeyDown={this.onKeyPressed} tabIndex="0"></input>);
    }

    getSelectControl(key) {
        let options = this.props.selectOptions[key];
        let value = this.state[key];

        return (<select name={key}
                        onChange={this.handleChange}
                        value={value}
        >
            {options.map((opt) => <option key={opt} name={opt} value={opt}>{opt}</option>)}
        </select>);
    }

    getInputItem(key) {
        let type = this.props.editableValType[this.props.editableVals.indexOf(key)];
        switch (type) {
            case 'select':
                return this.getSelectControl(key);
            case 'date':
                return this.getDateControl(key);
            default:
                return (<input name={key}
                               onChange={this.handleChange}
                               type={type}
                               value={this.state[key]}></input>);
        }


    }

    onKeyPressed(e) {
        e.preventDefault();
    }


    getEditMode() {
        return (<tr className="edit">
            {
                this.props.values.map((key, index) => {
                    if (this.props.editableVals.indexOf(key) !== -1) {
                        return <td key={index}>
                            {this.getInputItem(key)}
                        </td>;
                    } else {
                        return <td className="non-editable" key={index}>{key == 'index' ?
                            this.props.model.get(key): this.state[key]}</td>;
                    }

                })
            }
            <td className="trips__table__actions">
                <span title="Save" className="oi oi-check" onClick={this.saveRow}></span>
                <span title="Cancel" className="oi oi-x" onClick={this.editToggle}></span>
                <span title="Delete" className="oi oi-trash" onClick={this.deleteRow}></span>
            </td>
        </tr>);
    }

    saveRow(e) {
        if (this.runValidators()) {
            for (let key in this.state) {
                if (key !== 'index') {
                    this.props.model.set(key, this.state[key]);
                }
            }
            this.props.model.save().then(this.onSaveCallBack);
        }

    }

    onSaveCallBack(data) {
        this.editToggle();
    }

    deleteRow(e) {
        this.props.model.del().then((rowId) => this.props.onRemoveRow(rowId));
    }

    handleChange(e) {
        let {name, value} = e.target;
        //this.props.model.set(name, value);
        this.setState({
            [name]: value
        });

        this.setState((newState, props) => {
            let derivedProps = this.processDeriveProperties(newState);
            this.runValidators(newState);
            return Object.assign({}, newState, derivedProps);
        });


    }

    render() {
        return this.state.edit ? this.getEditMode() : this.getViewMode();
    }

}


export class EditableRowUsers extends EditableRow {
    constructor(props) {
        super(props);
    }

    getViewModeCell(key, index) {
        if (this.props.role === 'admin' && key === 'username') {
            return (<td key={index}>
                <Link
                    to={`/users/${this.state.username}/${this.state.userid}/trips`}> {this.props.model.get(key)} </Link>
            </td>);
        }
        return <td key={index}>{this.props.model.get(key)}</td>;
    }

    getDefaultState() {
        let parent = super.getDefaultState();
        return Object.assign({userid: this.props.model.get('userid')}, parent);
    }

    onSaveCallBack(data) {
        this.setState({
            userid: data.userid
        }, this.editToggle);
    }
}
