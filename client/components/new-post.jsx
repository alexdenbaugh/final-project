import React from 'react';
import debounce from '../lib/debounce';

export default class NewPostForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchView: false,
      gameList: [],
      gameSearch: '',
      searchStatus: 'empty',
      chosenGame: null
    };
    this.handleSearch = this.handleSearch.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.runSearch = debounce(this.runSearch.bind(this), 500);
    this.handleType = this.handleType.bind(this);
    this.renderSearch = this.renderSearch.bind(this);
    this.handlePost = this.handlePost.bind(this);
  }

  handleSearch(event) {
    // console.log(typeof event.target.dataset.gameid, event.target.dataset.gameid);
    const chosenGame = this.state.gameList.find(gameObject => gameObject.gameId === event.target.dataset.gameid);
    // console.log(chosenGame);
    fetch(`/api/boardGameInfo/${chosenGame.gameId}`)
      .then(response => response.json())
      .then(gameInfo => {
        gameInfo.name = chosenGame.name;
        gameInfo.gameId = chosenGame.gameId;
        // console.log('gameInfo', gameInfo);
        this.setState({ chosenGame: gameInfo, searchStatus: 'empty', searchView: false });
      })
      .then(() => {
        this.setState({ searchStatus: 'chosen' });
      });
  }

  handleClick() {
    this.setState({ searchView: true });
    this.runSearch();
  }

  handleType(event) {
    if (event.target.value !== this.state.gameSearch) {
      this.setState({ gameSearch: event.target.value });
      this.runSearch();
    }
  }

  runSearch() {
    if (this.state.gameSearch.length > 0) {
      this.setState({ searchStatus: 'searching' });
      fetch(`/api/boardGames/${this.state.gameSearch}`)
        .then(response => response.json())
        .then(games => {
          // console.log(games)
          if (games.error || games.length < 1) {
            this.setState({ searchStatus: 'none' });
          } else {
            this.setState({ gameList: games, searchStatus: 'result' });
          }
          // console.log('state', this.state)
        });
    } else {
      this.setState({ searchStatus: 'empty' });
      // console.log('state', this.state)
    }
  }

  handlePost(event) {
    event.preventDefault();
    // console.log(event.target)
    // console.log(this.state.chosenGame)
    // const header = new Headers();
    // header.append('Content-Type', 'application/json');
    // // const {
    // //   description: lender,
    // //   gameId,
    // //   imageUrl: gameImg,
    // //   max
    // // }
    // const init = {
    //   method: 'POST',
    //   headers: header,
    //   body: JSON.stringify(body)
    // };
    // fetch('/boardGamePosts', init)
    //   .then(response => response.json())
    //   .then(post => {
    //     console.log(post)
    //   });
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
          <div className="row">
            <div className="col-2 image-post">
              <img className="shadow" src={chosenGame.imageUrl} alt={chosenGame.name} />
            </div>
            <div className="col-2">
              <div className="form-element">
                <div className="label bookmark shadow">
                  <label className="orange" htmlFor="new-game-search">Name of Game:</label>
                </div>
                <div className="search-input shadow">
                  <div className="search-icon">
                    <label htmlFor="new-game-search"><i className="orange fas fa-search"></i></label>
                  </div>
                  <input onClick={this.handleClick} required type="text" className="lora" id="new-game-search" value={chosenGame.name} placeholder="Search for a game..." />
                </div>
              </div>
              <div className="form-element">
                <div className="label bookmark shadow">
                  <label className="orange" htmlFor="new-game-name">Your Name:</label>
                </div>
                <div className="input">
                  <input required type="text" className="lora shadow" id="new-game-name" />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="form-element">
              <div className="label bookmark shadow">
                <label className="orange" htmlFor="new-game-comments">Comments:</label>
              </div>
              <div className="input">
                <textarea required className="lora shadow" name="new-game-comments" id="new-game-comments" cols="30" rows="8"></textarea>
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
          <div className="row">
            <div className="col-2 image-post">
              <img className="shadow" src=".\images\placeholder-image-square.jpg" alt="game image" />
            </div>
            <div className="col-2">
              <div className="form-element">
                <div className="label bookmark shadow">
                  <label className="orange" htmlFor="new-game-search">Name of Game:</label>
                </div>
                <div className="search-input shadow">
                  <div className="search-icon">
                    <label htmlFor="new-game-search"><i className="orange fas fa-search"></i></label>
                  </div>
                  <input onClick={this.handleClick} required type="text" className="lora" id="new-game-search" placeholder="Search for a game..." />
                </div>
              </div>
              <div className="form-element">
                <div className="label bookmark shadow">
                  <label className="orange" htmlFor="new-game-name">Your Name:</label>
                </div>
                <div className="input">
                  <input required type="text" className="lora shadow" id="new-game-name" />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="form-element">
              <div className="label bookmark shadow">
                <label className="orange" htmlFor="new-game-comments">Comments:</label>
              </div>
              <div className="input">
                <textarea required className="lora shadow" name="new-game-comments" id="new-game-comments" cols="30" rows="8"></textarea>
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
    if (this.state.searchView) {
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
          <div className="row">
            <div className="search-input shadow">
              <div className="search-icon">
                <label htmlFor="new-game-search-modal"><i className="orange fas fa-search"></i></label>
              </div>
              <input autoComplete="off" onKeyUp={this.handleType} required type="text" className="lora" id="new-game-search-modal" name='game' placeholder="Search for a game..." />
            </div>
          </div>
          <div className="row">
            { this.renderSearch() }
          </div>
        </div>
      </>
    );
  }
}

function SearchList(props) {
  // console.log(props)
  const gameList = props.list.map(item => {
    return (
      <GameItem key={item.gameId} value={item.name} handleSearch={props.handleSearch} id={item.gameId} />
    );
  });
  return (
    <div className="row search-list shadow">
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
