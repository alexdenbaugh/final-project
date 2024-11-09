import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/header';
import PageContainer from './components/page-container';
import NewPostForm from './pages/new-post';
import AppContext from './lib/app-context';
import Posts from './pages/posts';
import PostInfo from './pages/post-info';
import NavBarModal from './components/nav-bar-modal';
import Auth from './pages/auth';
import Home from './pages/home';
import Messages from './pages/messages';
import Conversation from './pages/conversation';
import decodeToken from './lib/decode-token';

export default function App() {
  const [user, setUser] = useState(null);
  const [isAuthorizing, setIsAuthorizing] = useState(true);
  const [modal, setModal] = useState('hidden');
  // eslint-disable-next-line no-unused-vars
  const [bgColor, setBgColor] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('phoenix-games-jwt');
    const user = token ? decodeToken(token) : null;
    setUser(user);
    setIsAuthorizing(false);
  }, []);

  const handleSignIn = result => {
    const { user, token } = result;
    localStorage.setItem('phoenix-games-jwt', token);
    setUser(user);
  };

  const handleSignOut = () => {
    localStorage.removeItem('phoenix-games-jwt');
    setUser(null);
  };

  const handleHeader = event => {
    if (!event) {
      setModal('hidden');
    } else if (event.target.dataset.view === 'burger-menu') {
      setModal('burger-menu');
    } else if (event.target.dataset.view === 'user-menu') {
      setModal('user-menu');
    } else if (event.target.dataset.view === 'new-message') {
      setModal('new-message');
    } else {
      setModal('hidden');
    }
  };

  if (isAuthorizing) return null;

  return (
    <BrowserRouter>
      <AppContext.Provider value={{
        bgColor,
        modal,
        user,
        handleSignIn,
        handleSignOut,
        handleHeader
      }}>
        <Header />
        <main className={bgColor}>
          <PageContainer>
            <Routes>
              <Route path="/create-post" element={
                <ProtectedRoute>
                  <NewPostForm />
                </ProtectedRoute>
              } />
              <Route path="/posts" element={
                <ProtectedRoute>
                  <Posts />
                </ProtectedRoute>
              } />
              <Route path="/post/:postId" element={
                <ProtectedRoute>
                  <PostInfo />
                </ProtectedRoute>
              } />
              <Route path="/conversation/:otherId/:postId" element={
                <ProtectedRoute>
                  <Conversation />
                </ProtectedRoute>
              } />
              <Route path="/sign-up" element={<Auth />} />
              <Route path="/sign-in" element={<Auth />} />
              <Route path="/messages" element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              } />
              <Route path="/" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </PageContainer>
        </main>
        <NavBarModal />
      </AppContext.Provider>
    </BrowserRouter>
  );
}

// Protected Route component
function ProtectedRoute({ children }) {
  const { user } = React.useContext(AppContext);
  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  return children;
}
