import React from 'react';
import AppContext from '../lib/app-context';

export default class Header extends React.Component {

  render() {
    const { path } = this.context.route;
    return (
      <>
        <header className="shadow">
          <div className="mobile-container">
            <div onClick={this.context.handleHeader} className="header-icon" data-view="burger-menu">
              <button onClick={this.context.handleHeader} className="text-shadow" data-view="burger-menu"><i onClick={this.context.handleHeader} className="fas fa-bars" data-view="burger-menu"></i></button>
            </div>
            <div className="logo-icon">
              <a href="#" className="text-shadow logo-text" data-view="pheonix">&nbsp;Phoenix <br />Games&nbsp;<i className="phoenix-logo fab fa-phoenix-framework" data-view="pheonix"></i></a>
            </div>
            <div onClick={this.context.handleHeader} className="header-icon" data-view="user-menu">
              <button onClick={this.context.handleHeader} className="text-shadow" data-view="user-menu"><i onClick={this.context.handleHeader} data-view="user-menu" className="fas fa-user"></i></button>
            </div>
          </div>
          <div className="desktop-container">
            <div className="header-links-container">
              <div className="header-link-logo">
                <a href="#" className="text-shadow logo-text" data-view="pheonix">Phoenix Games&nbsp;<i className="phoenix-logo fab fa-phoenix-framework" data-view="pheonix"></i></a>
              </div>
              <div className="header-link">
                <a href="#posts" className="text-shadow">Posts</a>
              </div>
              <div className="header-link">
                <a href="#create-post" className="text-shadow">Make a Post</a>
              </div>
            </div>
            <div onClick={this.context.handleHeader} className="header-icon" data-view="user-menu">
              <a href={`#${path}`} onClick={this.context.handleHeader} className="text-shadow" data-view="user-menu"><i onClick={this.context.handleHeader} data-view="user-menu" className="fas fa-user"></i></a>
            </div>
          </div>
        </header>
      </>
    );
  }
}

Header.contextType = AppContext;
