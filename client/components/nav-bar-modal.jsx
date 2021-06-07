import React from 'react';
import AppContext from '../lib/app-context';
import NewMessage from './new-message';

export default class NavBarModal extends React.Component {
  constructor(props) {
    super(props);
    this.renderMenu = this.renderMenu.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    if (event.target.dataset.view === 'new-post') {
      window.location.hash = 'create-post';
    }
  }

  renderMenu() {
    const { modal } = this.context;
    const userLink = this.context.user
      ? 'Sign-Out'
      : 'Sign-In / Sign-Up';
    if (modal === 'burger-menu') {
      return (
        <>
          <a href="#posts" className={`shadow text-shadow ${modal}-item`}>
            <div className="menu-item-type">
              <div className="menu-item-icon">
                <i className="fas fa-dice"></i>
              </div>
              <div className="menu-item-text">
                <h3>Game Posts</h3>
              </div>
            </div>
            <div className="menu-item-arrow">
              <i className="fas fa-chevron-right"></i>
            </div>
          </a>
          <a href="#create-post" onClick={this.handleClick} className="shadow text-shadow burger-menu-item" data-view="new-post">
            <div className="menu-item-type" data-view="new-post">
              <div className="menu-item-icon" data-view="new-post">
                <i className="fas fa-plus" data-view="new-post"></i>
              </div>
              <div className="menu-item-text" data-view="new-post">
                <h3 data-view="new-post">New Post</h3>
              </div>
            </div>
            <div data-view="new-post" className="menu-item-arrow">
              <i data-view="new-post" className="fas fa-chevron-right"></i>
            </div>
          </a>
        </>
      );
    } else if (modal === 'user-menu' && this.context.user) {
      return (
        <a href="#sign-in" onClick={this.context.handleSignOut} className={`shadow text-shadow ${modal}-item`}><h3>{userLink}</h3></a>
      );
    } else if (modal === 'user-menu') {
      return (
        <a href="#sign-in" className={`shadow text-shadow ${modal}-item`}><h3>{userLink}</h3></a>
      );
    } else if (modal === 'new-message') {
      return (
        <NewMessage user={this.context.user} postId={this.context.route.params.get('postId')} handleHeader={this.context.handleHeader} />
      );
    }
  }

  render() {
    const { modal, handleHeader } = this.context;
    const hidden = modal === 'hidden'
      ? 'hidden'
      : '';

    if (modal === 'new-message') {
      return (
        <div onClick={handleHeader} className={`${hidden} new-message-modal-container`}>
          {this.renderMenu()}
        </div>
      );
    } else {
      return (
        <div onClick={handleHeader} className={`${hidden} ${modal}-nav-modal-container`}>
          <div className={`${modal}-container`}>
            <div className={`shadow ${modal}-head`}>
              {modal === 'burger-menu'
                ? <button onClick={handleHeader} className="text-shadow close-menu"><i className="fas fa-times"></i></button>
                : <button onClick={handleHeader} className="text-shadow user-menu"><i className="fas fa-user"></i></button>
              }
            </div>
            <div className="menu-options">
              {this.renderMenu()}
            </div>
          </div>
        </div>
      );
    }
  }
}

NavBarModal.contextType = AppContext;
