import React from 'react';
import AppContext from '../lib/app-context';

export default class PageContainer extends React.Component {
  render() {
    const { bgColor } = this.context;
    return (
      <div className={`container ${bgColor}`}>
        { this.props.children }
      </div>
    );
  }
}

PageContainer.contextType = AppContext;
