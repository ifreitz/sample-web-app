import axios from 'axios'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class Register extends Component {
    constructor() {
        super();
        this.state = {
            name: '',
            email: '',
            password: '',
            gender: '',
            description: '',
            errors: []
        };
        
        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.handleRegistration = this.handleRegistration.bind(this);
        this.hasErrorFor = this.hasErrorFor.bind(this);
        this.renderErrorFor = this.renderErrorFor.bind(this);
    }

    handleFieldChange (event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    hasErrorFor (field) {
        return !!this.state.errors[field]
    }

    renderErrorFor (field) {
        if (this.hasErrorFor(field)) {
            return (
                <span className='helper-text'>
                    <strong>{this.state.errors[field][0]}</strong>
                </span>
            )
        }
    }

    handleRegistration (event) {
        event.preventDefault();

        const { history } = this.props;
        const user = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            gender: this.state.gender,
            description: this.state.description
        }

        axios.post('api/register', user).then(response => {
            history.push('/');
        }).catch(error => {
            if (error.response.status == 422) {
                this.setState({
                    errors: error.response.data.errors
                });
            } else {
                M.toast({html: 'Cannot get response from server. Please try again later.'})
            }
        });
    }

    render() {
        return (
            <div>
                <div className='row valign-wrapper sub-navigation'>
                    <h6 className='header-text-margin'>Registration</h6>
                </div>
                <hr className="row margin-zero"></hr>
                <form className="registration-form z-depth-3" onSubmit={this.handleRegistration}>
                    <blockquote>
                        <h5>Registration</h5>
                    </blockquote>
                    <div className="row">
                        <div className="input-field col s12">
                            <input id="name" type="text" className="validate" name='name' value={this.state.name} onChange={this.handleFieldChange} required/>
                            <label htmlFor="name">Name</label>
                            {this.renderErrorFor('name')}
                        </div>
                    </div>
                    <div className='row'>
                        <div className="input-field col s12">
                            <input id="email" type="email" className="validate" name='email' value={this.state.email} onChange={this.handleFieldChange} required/>
                            <label htmlFor="email">Email</label>
                            {this.renderErrorFor('email')}
                        </div>
                    </div>
                    <div className='row'>
                        <div className="input-field col s12">
                            <input id="password" type="password" className="validate" name='password' value={this.state.password} onChange={this.handleFieldChange} required/>
                            <label htmlFor="password">Password</label>
                            {this.renderErrorFor('password')}
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                            <textarea id="description" className="materialize-textarea validate" name='description' value={this.state.description} onChange={this.handleFieldChange} required></textarea>
                            <label htmlFor="description">Description</label>
                            {this.renderErrorFor('description')}
                        </div>
                    </div>
                    <div className='row'>
                        <div className="input-field col s12">
                            <select className="browser-default select-style" name='gender' value={this.state.gender} onChange={this.handleFieldChange} required>
                                <option disabled value="">Choose Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                            {this.renderErrorFor('gender')}
                        </div>
                    </div>
                    <button className="waves-effect waves-light btn registration-form-button" type="submit">submit</button>
                    <Link className="waves-effect waves-light btn registration-form-button" to='/'>Cancel</Link>
                </form>
                <div id="RunScriptHere"></div>
            </div>
        );
    }
}

export default Register;