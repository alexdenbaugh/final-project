import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AppContext from '../../lib/app-context';
import AuthForm from '../../components/auth-form/auth-form';

export default function Auth() {
  const { user, handleSignIn } = useContext(AppContext);
  const location = useLocation();
  const path = location.pathname.slice(1); // removes the leading slash

  if (user) return <Navigate to="/" replace />;
  return <AuthForm key={path} path={path} handleSignIn={handleSignIn} />;
}
