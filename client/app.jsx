import React from 'react';
import Header from './components/header';
import PageContainer from './components/page-container';
import NewPostForm from './pages/new-post';
import AppContext from './lib/app-context';
import Posts from './pages/posts';
import PostInfo from './pages/post-info';
import NavBarModal from './components/nav-bar-modal';
import parseRoute from './lib/parse-route';
import Auth from './pages/auth';
import Home from './pages/home';
import decodeToken from './lib/decode-token';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 'posts',
      bgColor: '',
      modal: 'hidden',
      user: null,
      isAuthorizing: true,
      route: parseRoute(window.location.hash)
    };
    this.handleHeader = this.handleHeader.bind(this);
    this.renderPage = this.renderPage.bind(this);
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      if (window.location.hash === '#create-post-search' || window.location.hash === '#post-search') {
        this.setState({ bgColor: 'bg-dark-grey' });
      } else {
        this.setState({ bgColor: '' });
      }
      this.setState({
        route: parseRoute(window.location.hash)
      });
    });
    const token = window.localStorage.getItem('phoenix-games-jwt');
    const user = token ? decodeToken(token) : null;
    this.setState({ user, isAuthorizing: false });
  }

  handleSignIn(result) {
    const { user, token } = result;
    window.localStorage.setItem('phoenix-games-jwt', token);
    this.setState({ user });
  }

  handleSignOut() {
    window.localStorage.removeItem('phoenix-games-jwt');
    this.setState({ user: null });
  }

  handleHeader(event) {
    if (event.target.dataset.view === 'burger-menu') {
      this.setState({ modal: 'burger-menu' });
    } else if (event.target.dataset.view === 'user-menu') {
      this.setState({ modal: 'user-menu' });
    } else {
      this.setState({ modal: 'hidden' });
    }
  }

  renderPage() {
    const { path } = this.state.route;
    if (path === 'create-post' || path === 'create-post-search') {
      return <NewPostForm />;
    }
    if (path === 'posts' || path === 'post-search') {
      return <Posts />;
    }
    if (path === 'post-info') {
      const postId = this.state.route.params.get('postId');
      return <PostInfo postId={postId} />;
    }
    if (path === 'sign-up' || path === 'sign-in') {
      return <Auth />;
    }
    if (path === '') {
      return <Home />;
    }
  }

  render() {
    if (this.state.isAuthorizing) {
      return null;
    }
    const { bgColor, route, modal, user } = this.state;
    const { handleHeader, handleSignIn, handleSignOut } = this;
    const contextValue = { bgColor, route, modal, handleHeader, user, handleSignIn, handleSignOut };
    return (
      <AppContext.Provider value={contextValue}>
        <Header />
        <main className={this.state.bgColor}>
          <PageContainer>
            {this.renderPage()}
          </PageContainer>
        </main>
        <NavBarModal />
      </AppContext.Provider>
    );
  }
}
