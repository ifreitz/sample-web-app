import axios from 'axios'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Redirect } from 'react-router-dom'

class GuestDashboard extends Component {
    constructor(){
        super();
        this.state = {
            id: "",
            name: "",
            email: "",
            gender: "",
            description: "",
            password: "",
            profile_pic: "",
            file: [],
            errors: []
        }

        this.handleLogout = this.handleLogout.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
    }

    handleLogout() {
        localStorage.removeItem('guest');
        this.props.history.push('/');
    }

    componentWillMount() {
        if (localStorage.getItem('guest')) {
            var user = JSON.parse(localStorage.getItem('guest'));
            this.state.id = user.id;
            this.state.name = user.name;
            this.state.email = user.email;
            this.state.password = user.password;
            this.state.description = user.description;
            this.state.gender = user.gender;
            this.state.profile_pic = user.profile_pic;
        }

        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.handleOnSubmit = this.handleOnSubmit.bind(this);
        this.hasErrorFor = this.hasErrorFor.bind(this);
        this.renderErrorFor = this.renderErrorFor.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
    }

    componentDidMount() {
        var elems = document.querySelectorAll('.sidenav');
        var instances = M.Sidenav.init(elems);
    }

    handleFieldChange (event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleFileChange (event) {
        this.setState({
            [event.target.name]: event.target.files[0]
        });
        if (event.target.files.length > 0) {
            $("#img_prev").attr("src", URL.createObjectURL(event.target.files[0]));
            $("#img_prev_con").show();
        } else {
            $("#img_prev_con").hide();
        }
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

    handleOnSubmit (event) {
        event.preventDefault();

        const form = new FormData();
        form.append('id', this.state.id);
        form.append('name', this.state.name);
        form.append('email', this.state.email);
        form.append('password', this.state.password);
        form.append('gender', this.state.gender);
        form.append('description', this.state.description);
        form.append('file', this.state.file);

        axios.post('api/update-user', form, { headers: {
            'content-type': `multipart/form-data; boundary=${form._boundary}`
        }}).then(response => {
            M.toast({html: 'Updated'});
            localStorage.setItem('guest', response.data);
            this.setState({
                name: response.data.name,
                email: response.data.email,
                password: response.data.password,
                gender: response.data.gender,
                description: response.data.description,
                profile_pic: response.data.profile_pic
            });
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

    render(){
        if (!localStorage.getItem('guest')) {
            return <Redirect to='/login'/>
        }
        return(
            <div>
                <div className='row valign-wrapper sub-navigation'>
                    <button data-target="slide-out" className="sidenav-trigger waves-effect waves-light btn" style={{marginLeft: '5px'}}>&#9777;</button>
                    <h6 className='header-text-margin hide-on-small-only'>My Profile</h6>
                    <div className='landing-page-div-buttons'>
                        <button className="waves-effect waves-light btn landing-page-buttons" onClick={this.handleLogout}>Logout</button>
                    </div>
                </div>
                <hr className="row margin-zero"></hr>
                <ul id="slide-out" className="sidenav">
                    <li>
                        <div className="user-view">
                            <div className="background" style={{background: 'indianred'}}>
                            </div>
                            <a href="#user">
                                <img className="circle" src={"storage/images/profiles/" + this.state.profile_pic} alt="" style={{background: 'white', objectFit: 'cover'}} />
                            </a>
                            <a href="#name">
                                <span className="white-text name">{this.state.name}</span>
                            </a>
                            <a href="#email">
                                <span className="white-text email">{this.state.email}</span>
                            </a>
                        </div>
                    </li>
                    <li>
                        <a className="subheader">Links</a>
                    </li>
                    <li>
                        <a href="#!">No Link yet</a>
                    </li>
                    <li>
                        <div className="divider"></div>
                    </li>
                    <li>
                        <a className="subheader">Description</a>
                    </li>
                    <li>
                        <span className="waves-effect" style={{padding: '0 33px'}}>{this.state.description}</span>
                    </li>
                </ul>
                <form className="registration-form z-depth-1" onSubmit={this.handleOnSubmit}>
                    <blockquote>
                        <h5>My Information</h5>
                    </blockquote>
                    <div className="row" style={{justifyContent: "center"}}>
                        <img className="circle" src={"storage/images/profiles/" + this.state.profile_pic} alt="" style={{background: 'lavender', objectFit: 'cover', width: '100px', height: '100px'}} />
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                            <input id="name" type="text" className="validate" name='name' value={this.state.name} onChange={this.handleFieldChange} required/>
                            <label className="active" htmlFor="name">Name</label>
                            {this.renderErrorFor('name')}
                        </div>
                    </div>
                    <div className='row'>
                        <div className="input-field col s12">
                            <input id="email" type="email" className="validate" name='email' value={this.state.email} onChange={this.handleFieldChange} required/>
                            <label className="active" htmlFor="email">Email</label>
                            {this.renderErrorFor('email')}
                        </div>
                    </div>
                    <div className='row'>
                        <div className="input-field col s12">
                            <input id="password" type="text" className="validate" name='password' value={this.state.password} onChange={this.handleFieldChange} required/>
                            <label className="active" htmlFor="password">Password</label>
                            {this.renderErrorFor('password')}
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                            <textarea id="description" className="materialize-textarea validate" name='description' value={this.state.description} onChange={this.handleFieldChange} required></textarea>
                            <label className="active" htmlFor="description">Description</label>
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
                    <div className="file-field input-field" style={{padding: '0 11px'}}>
                        <div className="btn">
                            <span>Update Pic</span>
                            <input id="file" type="file" name="file" accept="image/x-png,image/jpeg" onChange={this.handleFileChange}/>
                        </div>
                        <div className="file-path-wrapper">
                            <input className="file-path validate" type="text"/>
                        </div>
                        {this.renderErrorFor('file')}
                    </div>
                    <div id="img_prev_con" className="row" style={{justifyContent: "center", display: "none"}}>
                        <img id="img_prev" className="circle" alt="" style={{background: 'lavender', objectFit: 'cover', width: '100px', height: '100px'}} />
                    </div>
                    <button className="waves-effect waves-light btn registration-form-button" type="submit" style={{width: '95%'}}>update</button>
                </form>
            </div>
        );
    }
}

export default GuestDashboard;