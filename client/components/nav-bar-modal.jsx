import React from 'react';

export default class NavBarModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'hidden'
    };
    this.renderMenu = this.renderMenu.bind(this);
  }

  renderMenu() {
    if (this.state.type === 'burger-menu') {
      return (
        <>
          <button className={`shadow text-shadow ${this.state.type}-item`}>
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
          <button className="shadow text-shadow burger-menu-item">
            <div className="menu-item-type">
              <div className="menu-item-icon">
                <i className="fas fa-plus"></i>
              </div>
              <div className="menu-item-text">
                <h3>New Post</h3>
              </div>
            </div>
            <div className="menu-item-arrow">
              <i className="fas fa-chevron-right"></i>
            </div>
          </button>
        </>
      );
    } else if (this.state.type === 'user-menu') {
      return (
        <button className={`shadow text-shadow ${this.state.type}-item`}>Sign-up</button>
      );
    }
  }

  render() {
    const { type } = this.state;
    const hidden = type === 'hidden'
      ? 'hidden'
      : '';
    return (
      <div className={`${hidden} ${type}-nav-modal-container`}>
        <div className={`${type}-container`}>
          <div className={`shadow ${type}-head`}>
            {type === 'burger-menu'
              ? <a href="" className="text-shadow close-menu"><i className="fas fa-times"></i></a>
              : <a href="" className="text-shadow user-menu"><i className="fas fa-user"></i></a>
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
