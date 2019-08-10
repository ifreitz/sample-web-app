import axios from 'axios'
import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

class AdminDashboard extends Component {
    constructor() {
        super();
        this.state = {
            id: "",
            name: "",
            email: "",
            gender: "",
            description: "",
            password: "",
            deleteUserId: '',
            users: []
        }

        this.handleLogout = this.handleLogout.bind(this);
        this.handleDeleteUser = this.handleDeleteUser.bind(this);
        this.handleEditUser = this.handleEditUser.bind(this);
    }

    componentWillMount() {
        if (sessionStorage.getItem('admin')) {
            var user = JSON.parse(sessionStorage.getItem('admin'));
            this.state.id = user.id;
            this.state.name = user.name;
            this.state.email = user.email;
            this.state.password = user.password;
            this.state.description = user.description;
            this.state.gender = user.gender;
        }
    }

    componentDidMount() {
        axios.get('/api/registered-users').then(response => {
            this.setState({
                users: response.data
            })
        })
        var elems = document.querySelectorAll('.sidenav');
        var instances = M.Sidenav.init(elems);
    }

    handleLogout(event) {
        sessionStorage.removeItem('admin');
        this.props.history.push('/');
    }

    handleDeleteUser(id) {
        axios.delete(`api/delete/${id}`).then(success => {
            document.getElementById('table-content').removeChild(document.getElementById(id));
            M.toast({html: 'User deleted!'});
        }).catch(error => {
            M.toast({html: 'Sorry, cannot delete user right now. Please try again later.'})
        });
    }

    handleEditUser(user) {
        this.props.history.push({
            pathname: '/admin-edit-user',
            state: {
                user: user
            }
        });
    }
    
    render() {
        if (!sessionStorage.getItem('admin')) {
            return <Redirect to='/login'/>
        }

        const { users } = this.state;
        return (
            <div>
                <div className='row valign-wrapper sub-navigation'>
                    <button data-target="slide-out" className="sidenav-trigger waves-effect waves-light btn" style={{marginLeft: '5px'}}>&#9777;</button>
                    <h6 className='header-text-margin hide-on-small-only'>Admin Dashboard</h6>
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
                                <img className="circle" style={{background: 'white'}} />
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
                        <a className="subheader">User Type</a>
                    </li>
                    <li>
                        <a href="#!">Administrator</a>
                    </li>
                    <li>
                        <div className="divider"></div>
                    </li>
                    <li>
                        <a className="subheader">Description</a>
                    </li>
                    <li>
                        <span className="waves-effect" style={{paddingLeft: '33px'}}>{this.state.description}</span>
                    </li>
                </ul>
                <div className="content">
                    <h6>List of registered users</h6>
                    <table className="highlight responsive-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Gender</th>
                                <th>Description</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody id="table-content">
                            {users.map(user => (
                                <tr key={ user.id } id={ user.id }>
                                    <td>
                                        { user.name }
                                    </td>
                                    <td>
                                        { user.email }
                                    </td>
                                    <td>
                                        { user.gender }
                                    </td>
                                    <td>
                                        { user.description }
                                    </td>
                                    <td>
                                        <button className="waves-effect waves-light btn" onClick={() => this.handleEditUser(user)}>Edit</button>
                                        <button className="waves-effect waves-light btn" onClick={() => this.handleDeleteUser(user.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default AdminDashboard;