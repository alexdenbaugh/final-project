import React from 'react';
import AppContext from '../lib/app-context';
import AuthForm from '../components/auth-form';

export default class Auth extends React.Component {
  render() {
    const { path } = this.context.route;
    return (
      <AuthForm path={path} />
    );
  }
}

Auth.contextType = AppContext;
