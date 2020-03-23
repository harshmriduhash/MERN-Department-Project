import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';

import Navbar from './components/common/Navbar';
import PrivateRoute from './components/common/PrivateRoute';

//Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

import Request from './components/request/Request.js';
import RequestForm from './components/request/RequestForm';




//Actions
import { setCurrentUser } from './actions/authActions';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';



if (localStorage.jwtToken) {
 
  setAuthToken(localStorage.jwtToken);
  const decode = jwt_decode(localStorage.jwtToken);
  store.dispatch(setCurrentUser(decode));
}

class App extends Component {

  render(){
    return (
      <Provider store={store}>
      <Router>
       <div className="App">
       <Navbar />
       <Route exact path="/login" component={Login} />
       <Route exact path="/register" component={Register} />
       <Switch>
            <PrivateRoute exact path="/pending" component={Request} />
        </Switch>
        <Switch>
            <PrivateRoute exact path="/" component={RequestForm} />
        </Switch>
        <Switch>
            <PrivateRoute exact path="/approved" component={Request} />
        </Switch>
        <Switch>
            <PrivateRoute exact path="/incoming-request" component={Request} />
        </Switch>
        <Switch>
            <PrivateRoute exact path="/rejected" component={Request} />
        </Switch>
       </div>
      </Router>
      </Provider>
    );
  }
  }

export default App;
