import React from 'react';
import AppContext from '../lib/app-context';

export default class Auth extends React.Component {
  render() {
    const { path } = this.context.route;
    return (
      <a href={`#${path}`} > Auth form </a>
    );
  }
}

Auth.contextType = AppContext;
