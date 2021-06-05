import React from 'react';

export default class AuthForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      confirmPassword: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    // console.log('change!', event)
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    event.preventDefault();
    // console.log('submit!', event)
  }

  render() {
    const path = this.props.path;
    if (path === 'sign-up') {
      return (
        <div className="shadow auth-form-container">
          <div className="row auth-form-header">
            <h1 className="orange text-shadow auth-form-header-text">Create An Account</h1>
          </div>
          <form onSubmit={this.handleSubmit} className="row auth-form">
            <div className="form-element">
              <div className="label bookmark shadow">
                <label className="orange" htmlFor="username">Username:</label>
              </div>
              <div className="input auth-form-input">
                <input required autoFocus type="text" onChange={this.handleChange} className="lora shadow" name="username" id="username" />
                <i className="valid-icon fas fa-check"></i>
              </div>
            </div>
            <div className="form-element">
              <div className="label bookmark shadow">
                <label className="orange" htmlFor="password">Password:</label>
              </div>
              <div className="input auth-form-input">
                <input required type="password" onChange={this.handleChange} className="lora shadow" name="password" id="password" />
                <i className="invalid-icon fas fa-times"></i>
                <span className="invalid-text lora">Password doesn&apos;t meet the requirements</span>
              </div>
            </div>
            <div className="form-element">
              <div className="label bookmark shadow">
                <label className="orange" htmlFor="confirmPassword">Confirm Password:</label>
              </div>
              <div className="input auth-form-input">
                <input required type="password" onChange={this.handleChange} className="lora shadow" name="confirmPassword" id="confirmPassword" />
                <i className="invalid-icon fas fa-times"></i>
                <span className="invalid-text lora">Passwords don&apos;t match</span>
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
              <div className="form-button">
                <button className="shadow" type="submit">Create</button>
              </div>
            </div>
          </form>
        </div>
      );
    }
  }
}
