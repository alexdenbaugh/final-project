import React from 'react';
import AppContext from '../lib/app-context';

export default class NavBarModal extends React.Component {
  constructor(props) {
    super(props);
    this.renderMenu = this.renderMenu.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    // console.log('inNavBar click', event)
    if (event.target.dataset.view === 'new-post') {
      window.location.hash = 'create-post';
    }
  }

  renderMenu() {
    const { modal } = this.context;
    if (modal === 'burger-menu') {
      return (
        <>
          <button href="#posts" className={`shadow text-shadow ${modal}-item`}>
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
          </button>
          <button href="#create-post" onClick={this.handleClick} className="shadow text-shadow burger-menu-item" data-view="new-post">
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
          </button>
        </>
      );
    } else if (modal === 'user-menu') {
      return (
        <></>
        // <button href="#sign-up" className={`shadow text-shadow ${this.state.type}-item`}>Sign-up</button>
      );
    }
  }

  render() {
    const { modal, handleHeader } = this.context;
    const hidden = modal === 'hidden'
      ? 'hidden'
      : '';
    return (
      <div onClick={handleHeader} className={`${hidden} ${modal}-nav-modal-container`}>
        <div className={`${modal}-container`}>
          <div className={`shadow ${modal}-head`}>
            {modal === 'burger-menu'
              ? <a onClick={handleHeader} href="" className="text-shadow close-menu"><i className="fas fa-times"></i></a>
              : <a onClick={handleHeader} href="" className="text-shadow user-menu"><i className="fas fa-user"></i></a>
            }
          </div>
          <div className="menu-options">
            { this.renderMenu() }
          </div>
        </div>
      </div>
    );
  }
}

NavBarModal.contextType = AppContext;
