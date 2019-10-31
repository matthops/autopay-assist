import React, { Component } from 'react';
import axios from 'axios';
import './Login.scss';

export default class Login extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      isAdmin: false
    };
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  handleUsernameInput(value) {
    this.setState({ username: value });
  }

  handlePasswordInput(value) {
    this.setState({ password: value });
  }

  toggleAdmin() {
    const { isAdmin } = this.state;
    this.setState({ isAdmin: !isAdmin });
  }

  login() {
    const { username, password } = this.state;
    // axios POST to /auth/login here
    console.log('USERNAME', username);
    axios
      .post('/auth/login', {
        username,
        password
      })
      .then(user => {
        this.props.updateUser(user.data);
        console.log('logged in');
      })
      .catch(err => {
        alert(err.response.request.response);
      });
  }

  register() {
    // axios POST to /auth/register here
    const { username, password, isAdmin } = this.state;
    axios
      .post('/auth/register', {
        username,
        password,
        isAdmin
      })
      .then(res => {
        this.props.updateUser(res.data);
      })
      .catch(err => {
        alert(err.response.request.response);
      });
  }

  logout() {
    // axios GET to /auth/logout here
    axios
      .get('/auth/logout')
      .then(() => {
        this.props.updateUser({});
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    const { username, password } = this.state;
    // const { user } = this.props;
    return (
      <div className="loginPage">
        <div className="loginWindow">
          <div className="loginContent">
            <div className="title">MoneyAware</div>
            <div className="loginContainer">
              <div className="inputContainer">
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={e => this.handleUsernameInput(e.target.value)}
                  className="textfield"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={e => this.handlePasswordInput(e.target.value)}
                  className="textfield"
                />
              </div>

              <div className="btnContainer">
                <button className="loginButtons" onClick={this.login}>
                  Log In
                </button>
                <div className="registerText" onClick={this.register}>
                  Register
                </div>
                {/* <div className="adminCheck">
                  <input
                    type="checkbox"
                    id="adminCheckbox"
                    onChange={() => this.toggleAdmin()}
                  />{' '}
                  <span> Admin </span>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
