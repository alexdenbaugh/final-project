import React from 'react';
import Header from './components/header';
import PageContainer from './components/page-container';
import NewPostForm from './components/new-post';
import AppContext from './lib/app-context';

export default class App extends React.Component {

  renderPage() {
    return (
      <>
        <NewPostForm />
      </>
    );
  }

  render() {
    const contextValue = {};
    return (
      <>
        <Header />
        <AppContext.Provider value={ contextValue }>
          <main>
            <PageContainer>
              { this.renderPage() }
            </PageContainer>
          </main>
        </AppContext.Provider>
      </>
    );
  }
}
