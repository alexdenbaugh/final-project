import React from 'react';

export default class Header extends React.Component {
  render() {
    return (
      <>
        <header className="shadow">
          <div className="header-icon">
            <a href="#"><i className="fab fa-phoenix-framework"></i></a>
          </div>
        </header>
      </>
    );
  }
}
