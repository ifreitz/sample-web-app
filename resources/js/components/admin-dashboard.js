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
            totalUsers: 0,
            numberPage: 0,
            currentPage: 1,
            search: '',
            users: []
        }

        this.handleLogout = this.handleLogout.bind(this);
        this.handleDeleteUser = this.handleDeleteUser.bind(this);
        this.handleEditUser = this.handleEditUser.bind(this);
        this.handlePaginate = this.handlePaginate.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.handleSortColumnTable = this.handleSortColumnTable.bind(this);
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
        axios.get(`/api/registered-users/${1}`).then(response => {
            this.setState({
                users: response.data.data,
                totalUsers: response.data.total,
                numberPage: response.data.last_page
            })
        })
        var elems = document.querySelectorAll('.sidenav');
        var instances = M.Sidenav.init(elems);
    }

    handleFieldChange (event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSearch() {
        if (this.state.search === '') {
            axios.get(`/api/registered-users/${1}`).then(response => {
                this.setState({
                    users: response.data.data,
                    totalUsers: response.data.total,
                    numberPage: response.data.last_page
                })
            });
        } else {
            axios.get(`/api/search-users/${this.state.search}`).then(response => {
                this.setState({
                    users: response.data.data,
                    totalUsers: response.data.total,
                    numberPage: response.data.last_page
                })
            });
        }
    }

    handlePaginate(event) {
        var page = event.target.innerText;
        if (page == 'next')
            page = this.state.currentPage + 1;
        else if (page == 'prev')
            page = this.state.currentPage - 1;
        
        if (page > 0 && page <= this.state.numberPage) {
            axios.get(`/api/registered-users/${page}`).then(response => {
                this.setState({
                    users: response.data.data
                })
            });
            this.setState({
                currentPage: parseInt(page)
            });
            
            $('li.active').removeClass();
            $('li#page'+page).addClass('active');
        }
    }

    handleSortColumnTable (event) {
        var th = event.target;
        var tdIndex = 0;
        var table, rows, switching, i, x, y, shouldSwitch;
        table = document.getElementById("my-table");

        if (th.className === "asc") {
            th.className = "desc";
        } else {
            th.className = "asc";
        }

        if (th.id === "th0") {
            tdIndex = 0;
        } else if (th.id === "th1") {
            tdIndex = 1;
        } else if (th.id === "th2") {
            tdIndex = 2;
        } else {
            tdIndex = 3;
        }

        switching = true;
        while (switching) {
            switching = false;
            rows = table.rows;
            for (i = 1; i < (rows.length - 1); i++) {
                shouldSwitch = false;
                x = rows[i].getElementsByTagName("TD")[tdIndex];
                y = rows[i + 1].getElementsByTagName("TD")[tdIndex];
                if (th.className === "asc") {
                    if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                        shouldSwitch = true;
                        break;
                    }
                } else {
                    if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                        shouldSwitch = true;
                        break;
                    }
                }
            }
            if (shouldSwitch) {
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;
            }
        }
    }

    handleLogout(event) {
        sessionStorage.removeItem('admin');
        this.props.history.push('/');
    }

    handleDeleteUser(id) {
        axios.delete(`api/delete/${id}`).then(success => {
            var updatedUsers = [];
            this.state.users.map(user => {
                if (user.id !== id) {
                    updatedUsers.push(user);
                }
            });
            this.setState({
                users: updatedUsers
            })
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
        var pagination = [];

        pagination.push(<li key="left"><a href="#!" onClick={this.handlePaginate}>prev</a></li>);
        for (var i = 1; i <= this.state.numberPage; i++) {
            if (i == 1)
                pagination.push(<li className="active" id={"page" + i} key={i} onClick={this.handlePaginate}><a href="#!">{i}</a></li>);
            else 
                pagination.push(<li id={"page" + i} key={i} onClick={this.handlePaginate}><a href="#!">{i}</a></li>);
        }
        pagination.push(<li key="right"><a href="#!" onClick={this.handlePaginate}>next</a></li>);

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
                    <div className="row" style={{alignItems: 'center', justifyContent: 'flex-end'}}>
                        <h6 className="hide-on-small-only" style={{position: 'absolute', left: '20px'}}>List of registered users</h6>
                        <input placeholder="Name" id="search" name="search" type="text" className="validate" style={{width: '250px', marginRight: '5px'}} value={this.state.search} onChange={this.handleFieldChange}/>
                        <button className="waves-effect waves-dark btn white" type="submit" onClick={this.handleSearch}>&#128270;</button>
                    </div>
                    <table id="my-table" className="highlight responsive-table">
                        <thead>
                            <tr>
                                <th className="asc" id="th0" style={{cursor: "row-resize"}} onClick={this.handleSortColumnTable}>Name</th>
                                <th className="asc" id="th1" style={{cursor: "row-resize"}} onClick={this.handleSortColumnTable}>Email</th>
                                <th className="asc" id="th2" style={{cursor: "row-resize"}} onClick={this.handleSortColumnTable}>Gender</th>
                                <th className="asc" id="th3" style={{cursor: "row-resize"}} onClick={this.handleSortColumnTable}>Description</th>
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
                    <ul className="pagination" style={{marginTop: '10px', justifyContent: 'center'}}>
                        {pagination}
                    </ul>
                </div>
            </div>
        );
    }
}

export default AdminDashboard;