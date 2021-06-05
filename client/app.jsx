import React from 'react';
import Header from './components/header';
import PageContainer from './components/page-container';
import NewPostForm from './components/new-post';
import AppContext from './lib/app-context';
import Posts from './components/posts';
import NavBarModal from './components/nav-bar-modal';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 'posts',
      bgColor: ''
    };
    this.handleHeader = this.handleHeader.bind(this);
    this.backGroundColor = this.backGroundColor.bind(this);
  }

  handleHeader(event) {
    if (event.target.dataset.view === 'new-post-icon') {
      this.setState({ view: 'new', bgColor: '' });
    } else if (event.target.dataset.view === 'search-post-icon') {
      this.setState({ view: 'posts' });
    }
  }

  backGroundColor(props) {
    this.setState({ bgColor: props.bgColor });
  }

  renderPage() {
    if (this.state.view === 'new') {
      return (
        <>
          <NewPostForm />
        </>
      );
    } else if (this.state.view === 'posts') {
      return (
        <>
          <Posts />
        </>
      );
    }

  }

  render() {
    const { bgColor } = this.state;
    const { backGroundColor, handleHeader } = this;

    const contextValue = { bgColor, backGroundColor, handleHeader };
    return (
      <>
        <AppContext.Provider value={ contextValue }>
          <Header value={ contextValue } />
          <main className={ this.state.bgColor }>
            <PageContainer>
              { this.renderPage() }
            </PageContainer>
          </main>
          <NavBarModal />
        </AppContext.Provider>
      </>
    );
  }
}
