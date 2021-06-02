import React from 'react';
import debounce from '../lib/debounce';

export default class NewPostForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalView: 'none',
      gameList: [],
      gameSearch: '',
      searchStatus: 'empty',
      chosenGame: null,
      formNameValue: '',
      formGameValue: '',
      formCommentsValue: ''
    };
    this.handleSearch = this.handleSearch.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.runSearch = debounce(this.runSearch.bind(this), 500);
    this.handleType = this.handleType.bind(this);
    this.renderSearch = this.renderSearch.bind(this);
    this.handlePost = this.handlePost.bind(this);
  }

  handleSearch(event) {
    const chosenGame = this.state.gameList.find(gameObject => gameObject.gameId === event.target.dataset.gameid);
    fetch(`/api/boardGameInfo/${chosenGame.gameId}`)
      .then(response => response.json())
      .then(gameInfo => {
        gameInfo.name = chosenGame.name;
        gameInfo.gameId = chosenGame.gameId;
        this.setState({ chosenGame: gameInfo, searchStatus: 'empty', modalView: 'none' });
      })
      .then(() => {
        this.setState({ searchStatus: 'chosen', formGameValue: chosenGame.name });
      });
  }

  handleClick() {
    this.setState({ modalView: 'search' });
    this.runSearch();
  }

  handleChange(event) {
    const { name, value } = event.target;
    if (name === 'name') {
      this.setState({
        formNameValue: value
      });
    } else if (name === 'comments') {
      this.setState({
        formCommentsValue: value
      });
    }
  }

  handleType(event) {
    if (event.target.value !== this.state.gameSearch) {
      this.setState({ gameSearch: event.target.value }, this.runSearch);
    }
  }

  runSearch() {
    if (this.state.gameSearch.length > 0) {
      this.setState({ searchStatus: 'searching' });
      const currentSearch = this.activeSearch = fetch(`/api/boardGames/${this.state.gameSearch}`)
        .then(response => response.json())
        .then(games => {
          if (this.activeSearch !== currentSearch) return;
          if (games.error || games.length < 1) {
            this.setState({ searchStatus: 'none' });
          } else {
            this.setState({ gameList: games, searchStatus: 'result' });
          }
        });
    } else {
      this.setState({ searchStatus: 'empty' });
    }
  }

  handlePost(event) {
    event.preventDefault();
    const header = new Headers();
    header.append('Content-Type', 'application/json');
    let body = {
      comments: event.target.elements.comments.value,
      gameId: this.state.chosenGame.gameId,
      gameImg: this.state.chosenGame.imageUrl,
      game: event.target.elements.game.value,
      lender: event.target.elements.name.value
    };
    body = JSON.stringify(body);
    const init = {
      method: 'POST',
      headers: header,
      body: body
    };
    fetch('/api/boardGamePosts', init)
      .then(response => response.json())
      .then(post => {
        this.setState({
          chosenGame: null,
          formNameValue: '',
          formGameValue: '',
          formCommentsValue: ''
        });
      });
  }

  renderForm() {
    if (this.state.chosenGame) {
      const chosenGame = this.state.chosenGame;
      return (
        <>
          <div className="row">
            <div className="col-4 bookmark title shadow">
              <h1 className="orange">New Post</h1>
            </div>
          </div>
          <div className="row row-2">
            <div className="col-2 col image-post">
              <img className="shadow" src={chosenGame.imageUrl} alt={chosenGame.name} />
            </div>
            <div className="col-2 col text-post">
              <div className="form-element">
                <div className="label bookmark shadow">
                  <label className="orange" htmlFor="new-game-search">Name of Game:</label>
                </div>
                <div className="search-input shadow">
                  <div className="search-icon">
                    <label htmlFor="new-game-search"><i className="orange fas fa-search"></i></label>
                  </div>
                  <input onClick={this.handleClick} required type="text" name="game" className="lora" id="new-game-search" value={chosenGame.name} placeholder="Search for a game..." />
                </div>
              </div>
              <div className="form-element">
                <div className="label bookmark shadow">
                  <label className="orange" htmlFor="new-game-name">Your Name:</label>
                </div>
                <div className="input">
                  <input required type="text" onChange={this.handleChange} value={this.state.formNameValue} className="lora shadow" name="name" id="new-game-name" />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="form-element col">
              <div className="label bookmark shadow">
                <label className="orange" htmlFor="new-game-comments">Comments:</label>
              </div>
              <div className="input col-1">
                <textarea onChange={this.handleChange} value={this.state.formCommentsValue} required className="lora shadow" name="comments" id="new-game-comments" cols="30" rows="8"></textarea>
              </div>
            </div>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="row">
            <div className="col-4 bookmark title shadow">
              <h1 className="orange">New Post</h1>
            </div>
          </div>
          <div className="row row-2">
            <div className="col-2 col image-post">
              <img className="shadow" src=".\images\placeholder-image-square.jpg" alt="game image" />
            </div>
            <div className="col-2 col text-post">
              <div className="form-element">
                <div className="label bookmark shadow">
                  <label className="orange" htmlFor="new-game-search">Name of Game:</label>
                </div>
                <div className="search-input shadow">
                  <div className="search-icon">
                    <label htmlFor="new-game-search"><i className="orange fas fa-search"></i></label>
                  </div>
                  <input onClick={this.handleClick} readOnly required type="text" className="lora" id="new-game-search" value={this.state.formGameValue} placeholder="Search for a game..." />
                </div>
              </div>
              <div className="form-element">
                <div className="label bookmark shadow">
                  <label className="orange" htmlFor="new-game-name">Your Name:</label>
                </div>
                <div className="input">
                  <input onChange={this.handleChange} required type="text" className="lora shadow" value={this.state.formNameValue} id="new-game-name" />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="form-element col">
              <div className="label bookmark shadow">
                <label className="orange" htmlFor="new-game-comments">Comments:</label>
              </div>
              <div className="input col-1">
                <textarea onChange={this.handleChange} required className="lora shadow" name="new-game-comments" value={this.state.formCommentsValue} id="new-game-comments" cols="30" rows="8"></textarea>
              </div>
            </div>
          </div>
        </>
      );
    }
  }

  renderSearch() {
    if (this.state.searchStatus === 'none') {
      return (
        <div className="row search-message">
          <h3 className="orange">No games were found, try again</h3>
        </div>
      );
    } else
    if (this.state.searchStatus === 'searching') {
      return (
        <div className="row search-message">
          <h3 className="orange">Searching...</h3>
        </div>
      );
    } else if (this.state.searchStatus === 'result') {
      return (
        <>
          <SearchList list={this.state.gameList} handleSearch={this.handleSearch} />
        </>
      );
    } else if (this.state.searchStatus === 'chosen') {
      return (
        <div className="row search-message">
          <h3 className="orange">Loading Game...</h3>
        </div>
      );
    } else {
      return <></>;
    }
  }

  render() {
    let hidden;
    if (this.state.modalView === 'search') {
      hidden = '';
    } else {
      hidden = 'hidden';
    }
    return (
      <>
        <form onSubmit={this.handlePost} action="#" className="game-search" autoComplete="off" id="new-post-form">
          {this.renderForm()}
          <div className="row form-button">
            <button className="form-button shadow" type="submit">Post</button>
          </div>
        </form>
        <div onSubmit={this.handleSearch} className={`modal-container ${hidden}`}>
          <div className="row row-2">
            <div className="search-input shadow col-2">
              <div className="search-icon">
                <label htmlFor="new-game-search-modal"><i className="orange fas fa-search"></i></label>
              </div>
              <input autoComplete="off" onKeyUp={this.handleType} required type="text" className="lora" id="new-game-search-modal" name='game' placeholder="Search for a game..." />
            </div>
          </div>
          <div className="row row-2">
            { this.renderSearch() }
          </div>
        </div>
      </>
    );
  }
}

function SearchList(props) {
  const gameList = props.list.map(item => {
    return (
      <GameItem key={item.gameId} value={item.name} handleSearch={props.handleSearch} id={item.gameId} />
    );
  });
  return (
    <div className="col-2 search-list shadow">
      { gameList }
    </div>
  );
}

function GameItem(props) {
  const name = props.value;
  return (
    <button onClick={props.handleSearch} className="col-1 search-item shadow" data-gameid={props.id}>{ name }</button>
  );
}
