import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppContext from '../../lib/app-context';

export default function NavBarModal() {
  const { user, modal, handleHeader, handleSignOut } = useContext(AppContext);
  const navigate = useNavigate();

  const handleClick = event => {
    if (event.target.dataset.view === 'new-post') {
      navigate('/create-post');
    }
  };

  const renderMenu = () => {
    const userLink = user ? 'Sign-Out' : 'Sign-In';
    const userAction = user ? handleSignOut : () => navigate('/sign-in');

    if (modal === 'burger-menu') {
      return (
        <>
          <Link to="/" className="menu-option shadow" onClick={handleHeader}>
            <i className="fas fa-home"></i>
            <span>Home</span>
          </Link>
          <Link to="/posts" className="menu-option shadow" onClick={handleHeader}>
            <i className="fas fa-dice"></i>
            <span>Games</span>
          </Link>
          <button
            data-view="new-post"
            onClick={e => {
              handleClick(e);
              handleHeader();
            }}
            className="menu-option shadow">
            <i className="fas fa-plus-circle"></i>
            <span>New Post</span>
          </button>
          <Link to="/messages" className="menu-option shadow" onClick={handleHeader}>
            <i className="fas fa-envelope"></i>
            <span>Messages</span>
          </Link>
        </>
      );
    }

    return (
      <button onClick={() => {
        userAction();
        handleHeader();
      }} className="menu-option shadow">
        <i className="fas fa-sign-out-alt"></i>
        <span>{userLink}</span>
      </button>
    );
  };

  const hidden = modal === 'hidden' ? 'hidden' : '';

  const modalButton = modal === 'burger-menu'
    ? (
      <button
        onClick={handleHeader}
        className="text-shadow close-menu"
        type="button"
      >
        <i className="fas fa-times"></i>
      </button>
      )
    : (
      <button
        onClick={handleHeader}
        className="text-shadow user-menu"
        type="button"
      >
        <i className="fas fa-user"></i>
      </button>
      );

  return (
    <div onClick={handleHeader} className={`${hidden} ${modal}-nav-modal-container`}>
      <div className={`${modal}-container`}>
        <div className={`shadow ${modal}-head`}>
          {modalButton}
        </div>
        <div className="menu-options">
          {renderMenu()}
        </div>
      </div>
    </div>
  );
}
