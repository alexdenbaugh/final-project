import React from 'react';
import Header from './components/header';
import PageContainer from './components/page-container';
import NewPostForm from './components/new-post';
import AppContext from './lib/app-context';
import Posts from './components/posts';
import NavBarModal from './components/nav-bar-modal';
import parseRoute from './lib/parse-route';

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
    this.backGroundColor = this.backGroundColor.bind(this);
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      // console.log('change!')
      this.setState({
        route: parseRoute(window.location.hash)
      });
    });
  }

  handleHeader(event) {
    // console.log('handleheader event:', event)
    if (event.target.dataset.view === 'burger-menu') {
      this.setState({ modal: 'burger-menu' });
    } else if (event.target.dataset.view === 'user-menu') {
      this.setState({ modal: 'user-menu' });
    } else {
      this.setState({ modal: 'hidden' });
    }
  }

  backGroundColor(props) {
    this.setState({ bgColor: props.bgColor });
  }

  renderPage() {
    const { path } = this.state.route;
    if (path === 'create-post' || path === 'create-post-search') {
      return <NewPostForm />;
    }
    if (path === '' || path === 'posts' || path === 'post-search' || path === 'post-info') {
      return <Posts />;
    }
    // if (path === 'sign-up') {
    //   return <Auth />
    // }
  }

  render() {
    const { bgColor, route, modal } = this.state;
    const { backGroundColor, handleHeader } = this;

    const contextValue = { bgColor, route, modal, backGroundColor, handleHeader };
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
