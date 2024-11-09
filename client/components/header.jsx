import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AppContext from '../lib/app-context';

export default function Header() {
  const { handleHeader } = useContext(AppContext);

  return (
    <header className="header">
      <div className="row">
        <div className="col-3">
          <button onClick={handleHeader} className="burger-menu">
            <i className="fas fa-bars"></i>
          </button>
        </div>
        <div className="col-3">
          <Link to="/" className="header-logo">
            <h1>
              Phoenix Games
              <i className="fab fa-phoenix-framework"></i>
            </h1>
          </Link>
        </div>
        <div className="col-3">
          <button onClick={handleHeader} className="user-menu">
            <i className="fas fa-user"></i>
          </button>
        </div>
      </div>
    </header>
  );
}
