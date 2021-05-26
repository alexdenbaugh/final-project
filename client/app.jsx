import React from 'react';
import Home from './pages/home';
import Header from './components/header';
import PageContainer from './components/page-container';
import NewPostForm from './components/new-post';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      change: null
    };
  }

  renderPage() {
    return (
      <>
        <Home />
        <NewPostForm />
      </>
    );
  }

  render() {
    return (
      <>
        <Header />
        <PageContainer>
          { this.renderPage() }
        </PageContainer>
      </>
    );
  }
}
