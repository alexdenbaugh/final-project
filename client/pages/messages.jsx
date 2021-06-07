import React from 'react';
import AppContext from '../lib/app-context';

export default class Messages extends React.Component {
  render() {
    return (
      <h1>messages</h1>
    );
  }
}

Messages.contextType = AppContext;
