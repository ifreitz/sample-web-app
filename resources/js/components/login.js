import axios from 'axios'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Redirect } from 'react-router-dom'

class Login extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            user: 'guest',
            errors: []
        };

        this.handleLogin = this.handleLogin.bind(this);
        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.hasErrorFor = this.hasErrorFor.bind(this);
        this.handleUserType = this.handleUserType.bind(this);
        this.renderErrorFor = this.renderErrorFor.bind(this);
    }

    componentDidMount() {
        const Script = document.createElement('script');
        Script.type = 'text/javascript';
        Script.async = true;
        Script.innerHTML = 'M.Tabs.init(document.getElementsByClassName("tabs")[0])';
        document.body.appendChild(Script);
    }

    handleLogin(event) {
        event.preventDefault();

        const { history } = this.props;
        const user = {
            email: this.state.email,
            password: this.state.password,
            user: this.state.user
        }

        axios.post('api/login', user).then(response => {
            if (this.state.user === 'admin') {
                localStorage.setItem('admin', JSON.stringify(response.data[0]));
                history.push('/admin');
            } else {
                localStorage.setItem('guest', JSON.stringify(response.data[0]));
                history.push('/guest');
            }
        }).catch(error => {
            if (error.response.status == 422) {
                this.setState({
                    errors: error.response.data.errors
                });
            } else if (error.response.status == 404) {
                M.toast({html: 'User not found!'})
            } else if (error.response.status == 403) {
                M.toast({html: 'Password is incorrect!'})
            } else {
                M.toast({html: 'Error while connecting to server, please try again later'})
            }
        });
    }

    handleUserType(event) {
        const userType = event.target.innerHTML;
        if (userType === "Admin") {
            this.setState({
                user: 'admin'
            });
        } else {
            this.setState({
                user: 'guest'
            });
        }
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

    render() {
        if (sessionStorage.getItem('admin')) {
            return <Redirect to='/admin' />
        }
        if (sessionStorage.getItem('guest')) {

        }

        var tabStyle = { width: '50%' };
        var formStyle = { padding: '0 20px 20px 20px' };
        return (
            <div>
                <div className='row valign-wrapper sub-navigation'>
                    <h6 className='header-text-margin'>Login</h6>
                </div>
                <hr className="row margin-zero"></hr>
                <div className="login-forms z-depth-2">
                    <ul id="tabs-swipe-demo" className="tabs">
                        <li className="tab" style={tabStyle}>
                            <a className="active" href="#guest" onClick={this.handleUserType}>Guest</a>
                        </li>
                        <li className="tab" style={tabStyle}>
                            <a href="#admin" onClick={this.handleUserType}>Admin</a>
                        </li>
                    </ul>
                    <div id="guest" className="col s12">
                        <blockquote>
                            <h5>Login as guest</h5>
                        </blockquote>
                    </div>
                    <div id="admin" className="col s12">
                        <blockquote>
                            <h5>Login as administrator</h5>
                        </blockquote>
                    </div>
                    <form onSubmit={this.handleLogin} style={formStyle}>
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
                        <button className="waves-effect waves-light btn registration-form-button" type="submit">submit</button>
                        <Link className="waves-effect waves-light btn registration-form-button" to='/'>Cancel</Link>
                    </form>
                </div>
            </div>
        );
    }
}

export default Login;