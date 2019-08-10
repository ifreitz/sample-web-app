import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Header from './header';
import RegisteredUsers from './registered-users';
import Registration from './register';
import Login from './login';
import AdminDashboard from './admin-dashboard';
import AdminEditUser from './admin-edit-user';
import GuestDashboard from './guest-dashboard';

class App extends Component {
  render () {
    return (
      <BrowserRouter>
        <div>
          <Header />
          <Switch>
              <Route exact path='/' component={RegisteredUsers} />
              <Route path='/register' component={Registration} />
              <Route path='/login' component={Login} />
              <Route path='/admin' component={AdminDashboard} />
              <Route path='/admin-edit-user' component={AdminEditUser} />
              <Route path='/guest' component={GuestDashboard} />
          </Switch>
        </div>
      </BrowserRouter>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))