import axios from 'axios'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class RegisteredUsers extends Component {
    constructor() {
        super();
        this.state = {
            users: []
        }
    }

    componentDidMount () {
        axios.get('/api/registered-users').then(response => {
            this.setState({
                users: response.data
            })
        })
    }

    render() {
        const { users } = this.state;
        return (
            <div>
                <div className='row valign-wrapper sub-navigation'>
                    <h6 className='header-text-margin hide-on-small-only'>List of registered users</h6>
                    <div className='landing-page-div-buttons'>
                        <Link className="waves-effect waves-light btn landing-page-buttons" to='/login'>login</Link>
                        <Link className="waves-effect waves-light btn landing-page-buttons" to='/register'>register</Link>
                    </div>
                </div>
                <hr className="row margin-zero"></hr>
                <div className="landing-page-table">
                    <table className="highlight responsive-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Gender</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={ user.id }>
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
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default RegisteredUsers;