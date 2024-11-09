import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import checkPassword from '../lib/password-check';

export default function AuthForm({ path, handleSignIn }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
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
  });

  const handleCredentials = () => {
    const { username, password, confirmPassword } = formData;
    const passwordReq = checkPassword(password);
    const icons = {
      usernameIcon: username.length >= 6 ? 'fas fa-check' : 'hidden',
      passwordIcon: passwordReq ? 'fas fa-check' : 'hidden',
      confirmPasswordIcon: password === confirmPassword && password.length > 0 ? 'fas fa-check' : 'hidden',
      errorReq: !passwordReq && password.length > 0 ? 'Password requirements not met' : '',
      errorMatch: password !== confirmPassword && confirmPassword.length > 0 ? 'Passwords do not match' : ''
    };
    setFormData(prev => ({
      ...prev,
      ...icons
    }));
  };

  const handleSubmit = async event => {
    event.preventDefault();
    const { username, password } = formData;

    try {
      const response = await fetch(`/api/auth/${path}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const result = await response.json();

      if (result.error && path === 'sign-up') {
        setFormData(prev => ({
          ...prev,
          username: '',
          password: '',
          confirmPassword: '',
          usernameIcon: 'hidden',
          passwordIcon: 'hidden',
          confirmPasswordIcon: 'hidden',
          errorUser: 'Username taken, try another',
          errorReq: '',
          errorMatch: ''
        }));
      } else if (result.error && path === 'sign-in') {
        setFormData(prev => ({
          ...prev,
          errorLogin: 'Invalid username/password'
        }));
      } else {
        handleSignIn(result);
        navigate('/');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleChange = event => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (path === 'sign-up') {
      handleCredentials();
    }
  };

  const altHeader = path === 'sign-up' ? 'Create An Account' : 'Sign In';

  if (path === 'sign-up') {
    return (
      <div className="shadow auth-form-container">
        <div className="row auth-form-header">
          <h1 className="orange text-shadow auth-form-header-text">{altHeader}</h1>
        </div>
        <form onSubmit={handleSubmit} className="row auth-form">
          <div className="form-element">
            <div className="label bookmark shadow">
              <label className="orange" htmlFor="username">Username:</label>
            </div>
            <div className="input auth-form-input">
              <input
                required
                autoFocus
                minLength="6"
                maxLength="16"
                type="text"
                onChange={handleChange}
                value={formData.username}
                className="lora"
                name="username"
                id="username"
              />
              <i className={formData.usernameIcon}></i>
              {formData.errorUser && (
                <span className="invalid-text lora">{formData.errorUser}</span>
              )}
            </div>
          </div>
          <div className="form-element">
            <div className="label bookmark shadow">
              <label className="orange" htmlFor="password">Password:</label>
            </div>
            <div className="input auth-form-input">
              <input
                required
                type="password"
                minLength="8"
                maxLength="20"
                onChange={handleChange}
                value={formData.password}
                className="lora"
                name="password"
                id="password"
              />
              <i className={formData.passwordIcon}></i>
              {formData.errorReq && (
                <span className="invalid-text lora">{formData.errorReq}</span>
              )}
            </div>
          </div>
          <div className="form-element">
            <div className="label bookmark shadow">
              <label className="orange" htmlFor="confirmPassword">Confirm Password:</label>
            </div>
            <div className="input auth-form-input">
              <input
                required
                type="password"
                minLength="8"
                maxLength="20"
                onChange={handleChange}
                value={formData.confirmPassword}
                className="lora"
                name="confirmPassword"
                id="confirmPassword"
              />
              <i className={formData.confirmPasswordIcon}></i>
              {formData.errorMatch && (
                <span className="invalid-text lora">{formData.errorMatch}</span>
              )}
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
            <Link to="/sign-in" className="text-shadow auth-form-link">
              Sign In
            </Link>
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
          <h1 className="orange text-shadow auth-form-header-text">{altHeader}</h1>
        </div>
        <form onSubmit={handleSubmit} className="row auth-form">
          <div className="form-element">
            <div className="label bookmark shadow">
              <label className="orange" htmlFor="username">Username:</label>
            </div>
            <div className="input auth-form-input">
              <input
                required
                autoFocus
                type="text"
                onChange={handleChange}
                value={formData.username}
                className="lora"
                name="username"
                id="username"
              />
            </div>
          </div>
          <div className="form-element">
            <div className="label bookmark shadow">
              <label className="orange" htmlFor="password">Password:</label>
            </div>
            <div className="input auth-form-input">
              <input
                required
                type="password"
                onChange={handleChange}
                value={formData.password}
                className="lora"
                name="password"
                id="password"
              />
              {formData.errorLogin && (
                <span className="invalid-text lora">{formData.errorLogin}</span>
              )}
            </div>
          </div>
          <div className="row form-handles">
            <Link to="/sign-up" className="text-shadow auth-form-link">
              Create an Account
            </Link>
            <div className="form-button">
              <button className="shadow" type="submit">Sign In</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
