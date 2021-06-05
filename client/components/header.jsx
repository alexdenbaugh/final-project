import React from 'react';
import AppContext from '../lib/app-context';

export default class Header extends React.Component {

  render() {
    return (
      <>
        <header className="shadow">
          <div className="header-icon">
            <a href="#" onClick={this.context.handleHeader} className="text-shadow" data-view="search-post-icon"><i className="fas fa-bars"></i></a>
          </div>
          <div className="logo-icon">
            <a href="#" onClick={this.context.handleHeader} className="text-shadow logo-text" data-view="pheonix">&nbsp;Phoenix <br />Games&nbsp;<i className="phoenix-logo fab fa-phoenix-framework" data-view="pheonix"></i></a>
          </div>
          <div className="header-icon">
            <a href="#" onClick={this.context.handleHeader} className="text-shadow" data-view="new-post-icon"><i className="fas fa-user"></i></a>
          </div>
        </header>
      </>
    );
  }
}

Header.contextType = AppContext;
