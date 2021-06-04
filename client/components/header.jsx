import React from 'react';

export default class Header extends React.Component {

  render() {
    return (
      <>
        <header className="shadow">
          <div className="header-icon logo-icon">
            <a href="#" onClick={this.props.handleHeader} data-view="pheonix"><i className="fab fa-phoenix-framework" data-view="pheonix"></i></a>
          </div>
          <div className="header-icon-group">
            <div className="header-icon">
              <a href="#" onClick={this.props.handleHeader} data-view="search-post-icon"><i className="fas fa-search" data-view="search-post-icon"></i></a>
            </div>
            <div className="header-icon">
              <a href="#" onClick={this.props.handleHeader} data-view="new-post-icon"><i className="fas fa-plus" data-view="new-post-icon"></i></a>
            </div>
          </div>
        </header>
      </>
    );
  }
}
