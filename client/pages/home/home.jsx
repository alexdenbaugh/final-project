import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AppContext from '../../lib/app-context';

export default function Home() {
  const { user } = useContext(AppContext);

  if (!user) return <Navigate to="/sign-in" replace />;

  return (
    <div className="shadow home-container">
      <h2 className="text-shadow">Welcome to:</h2>
      <div className="home-logo-container">
        <h1 className="home-logo">
          &nbsp;Phoenix <br />Games&nbsp;
          <i className="home-phoenix-logo fab fa-phoenix-framework"></i>
        </h1>
      </div>
      <h2 className="text-shadow">
        Where your dusty boardgames can be brought back to life!
      </h2>
    </div>
  );
}
