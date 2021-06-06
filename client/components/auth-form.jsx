import React from 'react';
import checkPassword from '../lib/password-check';

export default class AuthForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      confirmPassword: '',
      usernameIcon: 'hidden',
      passwordIcon: 'hidden',
      confirmPasswordIcon: 'hidden',
      errorUser: '',
      errorReq: '',
      errorMatch: '',
      errorLogin: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleCredentials = this.handleCredentials.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    if (this.props.path === 'sign-up') {
      this.setState({ [name]: value }, this.handleCredentials);
    } else {
      this.setState({ [name]: value });
    }
  }

  handleCredentials() {
    const { username, password, confirmPassword } = this.state;
    if (password.length > 0 && password.length < 8) {
      this.setState({
        passwordIcon: 'invalid-icon fas fa-times', errorReq: ''
      });
    } else if (password.length >= 8 && !checkPassword(password)) {
      this.setState({
        passwordIcon: 'invalid-icon fas fa-times', errorReq: 'Password doesn\'t meet the requirements'
      });
    } else if (password.length >= 8) {
      this.setState({
        passwordIcon: 'valid-icon fas fa-check', errorReq: ''
      });
    } else {
      this.setState({
        passwordIcon: 'hidden', errorReq: ''
      });
    }
    if (confirmPassword.length === 0) {
      this.setState({
        confirmPasswordIcon: 'hidden', errorMatch: ''
      });
    } else if (confirmPassword === password) {
      this.setState({
        confirmPasswordIcon: 'valid-icon fas fa-check', errorMatch: ''
      });
    } else {
      this.setState({
        confirmPasswordIcon: 'invalid-icon fas fa-times', errorMatch: 'Password don\'t match'
      });
    }
    if (username.length === 0) {
      this.setState({
        usernameIcon: 'hidden', errorUser: ''
      });
    } else if (!username.match('^[0-9a-zA-Z]+$')) {
      this.setState({
        usernameIcon: 'invalid-icon fas fa-times', errorUser: 'No special characters'
      });
    } else if (username.length < 6) {
      this.setState({
        usernameIcon: 'invalid-icon fas fa-times', errorUser: ''
      });
    } else {
      this.setState({
        usernameIcon: 'valid-icon fas fa-check', errorUser: ''
      });
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    const { errorUser, errorReq, errorMatch, username, password } = this.state;
    const { path } = this.props;
    //
    if (errorUser || errorReq || errorMatch) {
      this.handleCredentials();
      return;
    }
    const init = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    };
    fetch(`/api/auth/${path}`, init)
      .then(res => res.json())
      .then(result => {
        if (result.error && path === 'sign-up') {
          this.setState({
            username: '',
            password: '',
            confirmPassword: '',
            usernameIcon: 'hidden',
            passwordIcon: 'hidden',
            confirmPasswordIcon: 'hidden',
            errorUser: 'Username taken, try another',
            errorReq: '',
            errorMatch: ''
          });
        } else if (result.error && path === 'sign-in') {
          this.setState({
            errorLogin: 'Invalid username/password'
          });
        } else {
          window.location.hash = '#';
          this.props.handleSignIn(result);
        }
      });
  }

  render() {
    const path = this.props.path;
    const altHeader = path === 'sign-up'
      ? 'Create An Account'
      : 'Sign In';
    if (path === 'sign-up') {
      return (
        <div className="shadow auth-form-container">
          <div className="row auth-form-header">
            <h1 className="orange text-shadow auth-form-header-text">{ altHeader }</h1>
          </div>
          <form onSubmit={this.handleSubmit} className="row auth-form">
            <div className="form-element">
              <div className="label bookmark shadow">
                <label className="orange" htmlFor="username">Username:</label>
              </div>
              <div className="input auth-form-input">
                <input required autoFocus minLength="6" maxLength="16" type="text" onChange={this.handleChange} value={this.state.username} className="lora shadow" name="username" id="username" />
                <i className={this.state.usernameIcon}></i>
                {
                  this.state.errorUser
                    ? <span className="invalid-text lora">{this.state.errorUser}</span>
                    : <></>
                }
              </div>
            </div>
            <div className="form-element">
              <div className="label bookmark shadow">
                <label className="orange" htmlFor="password">Password:</label>
              </div>
              <div className="input auth-form-input">
                <input required type="password" minLength="8" maxLength="20" onChange={this.handleChange} value={this.state.password} className="lora shadow" name="password" id="password" />
                <i className={this.state.passwordIcon}></i>
                {
                  this.state.errorReq
                    ? <span className="invalid-text lora">{this.state.errorReq}</span>
                    : <></>
                }
              </div>
            </div>
            <div className="form-element">
              <div className="label bookmark shadow">
                <label className="orange" htmlFor="confirmPassword">Confirm Password:</label>
              </div>
              <div className="input auth-form-input">
                <input required type="password" minLength="8" maxLength="20" onChange={this.handleChange} value={this.state.confirmPassword} className="lora shadow" name="confirmPassword" id="confirmPassword" />
                <i className={this.state.confirmPasswordIcon}></i>
                {
                  this.state.errorMatch
                    ? <span className="invalid-text lora">{this.state.errorMatch}</span>
                    : <></>
                }
              </div>
            </div>
            <div className="row">
              <div className="form-requirements lora">
                <span>Password requirements:</span>
                <ul>
                  <li>8 or more characters</li>
                  <li>At least 1 capital letter</li>
                  <li>At least one number</li>
                  <li>At least one special character</li>
                </ul>
              </div>
            </div>
            <div className="row form-handles">
              <a href="#sign-in" className="text-shadow auth-form-link">Sign In</a>
              <div className="form-button">
                <button className="shadow" type="submit">Create</button>
              </div>
            </div>
          </form>
        </div>
      );
    } else if (path === 'sign-in') {
      return (
        <div className="shadow auth-form-container">
          <div className="row auth-form-header">
            <h1 className="orange text-shadow auth-form-header-text">{ altHeader }</h1>
          </div>
          <form onSubmit={this.handleSubmit} className="row auth-form">
            <div className="form-element">
              <div className="label bookmark shadow">
                <label className="orange" htmlFor="username">Username:</label>
              </div>
              <div className="input auth-form-input">
                <input required autoFocus type="text" onChange={this.handleChange} value={this.state.username} className="lora shadow" name="username" id="username" />
              </div>
            </div>
            <div className="form-element">
              <div className="label bookmark shadow">
                <label className="orange" htmlFor="password">Password:</label>
              </div>
              <div className="input auth-form-input">
                <input required type="password" onChange={this.handleChange} value={this.state.password} className="lora shadow" name="password" id="password" />
                {
                  this.state.errorLogin
                    ? <span className="invalid-text lora">{this.state.errorLogin}</span>
                    : <></>
                }
              </div>
            </div>
            <div className="row form-handles">
              <a href="#sign-up" className="text-shadow auth-form-link">Create an Account</a>
              <div className="form-button">
                <button className="shadow" type="submit">Sign In</button>
              </div>
            </div>
          </form>
        </div>
      );
    }
  }
}
