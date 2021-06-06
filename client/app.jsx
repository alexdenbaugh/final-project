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

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 'posts',
      bgColor: '',
      modal: 'hidden',
      route: parseRoute(window.location.hash)
    };
    this.handleHeader = this.handleHeader.bind(this);
    this.renderPage = this.renderPage.bind(this);
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
    if (path === '' || path === 'posts' || path === 'post-search') {
      return <Posts />;
    }
    if (path === 'post-info') {
      const postId = this.state.route.params.get('postId');
      return <PostInfo postId={postId} />;
    }
    if (path === 'sign-up') {
      return <Auth />;
    }
  }

  render() {
    const { bgColor, route, modal } = this.state;
    const { handleHeader } = this;

    const contextValue = { bgColor, route, modal, handleHeader };
    return (
      <AppContext.Provider value={ contextValue }>
        <Header />
        <main className={ this.state.bgColor }>
          <PageContainer>
            { this.renderPage() }
          </PageContainer>
        </main>
        <NavBarModal />
      </AppContext.Provider>
    );
  }
}
