import React from 'react';
import AppContext from '../lib/app-context';
import AuthForm from '../components/auth-form';
import Redirect from '../components/redirect';

export default class Auth extends React.Component {
  render() {
    const { route, user, handleSignIn } = this.context;
    if (user) return <Redirect to="" />;
    return (
      <AuthForm key={route.path} path={ route.path } handleSignIn={handleSignIn} />
    );
  }
}

Auth.contextType = AppContext;
