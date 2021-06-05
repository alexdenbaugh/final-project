import React from 'react';
import AppContext from '../lib/app-context';

export default class Header extends React.Component {

  render() {
    const { path } = this.context.route;
    // console.log(path)
    return (
      <>
        <header className="shadow">
          <div onClick={this.context.handleHeader} className="header-icon" data-view="burger-menu">
            <a href={`#${path}`} onClick={this.context.handleHeader} className="text-shadow" data-view="burger-menu"><i onClick={this.context.handleHeader} className="fas fa-bars" data-view="burger-menu"></i></a>
          </div>
          <div className="logo-icon">
            <a href="#posts" className="text-shadow logo-text" data-view="pheonix">&nbsp;Phoenix <br />Games&nbsp;<i className="phoenix-logo fab fa-phoenix-framework" data-view="pheonix"></i></a>
          </div>
          <div onClick={this.context.handleHeader} className="header-icon" data-view="user-menu">
            <a href={`#${path}`} onClick={this.context.handleHeader} className="text-shadow" data-view="user-menu"><i onClick={this.context.handleHeader} data-view="user-menu" className="fas fa-user"></i></a>
          </div>
        </header>
      </>
    );
  }
}

Header.contextType = AppContext;
