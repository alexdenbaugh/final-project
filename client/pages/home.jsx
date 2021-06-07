import React from 'react';
import Redirect from '../components/redirect';
import AppContext from '../lib/app-context';

export default class Home extends React.Component {
  render() {
    if (!this.context.user) return <Redirect to="sign-in" />;
    return (
      <>
        <div className="shadow home-container">
          <h2 className="text-shadow">Welcome to:</h2>
          <div className="home-logo-container">
            <h1 className="home-logo">&nbsp;Phoenix <br />Games&nbsp;<i className="fab fa-phoenix-framework"></i></h1>
          </div>
          <h2 className="text-shadow">Where your dusty boardgames can be brought back to life!</h2>
        </div>
      </>
    );
  }
}

Home.contextType = AppContext;
