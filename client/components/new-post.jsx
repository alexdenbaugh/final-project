import React from 'react';

export default class NewPostForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchView: false,
      searchStatus: 'initial'
    };
    this.handleClick = this.handleClick.bind(this);
    this.searchStage = this.searchStage.bind(this);
  }

  handleSearch(event) {
    event.preventDefault();
    // console.log(event.target.game.value);
    // let game = event.target.game.value;
    // game = game.split(' ')
    // game = game.join('%20')
    // console.log(game)

    // let header = new Headers();
    // const init = {
    //   mode: 'no-cors'
    // }

  }

  handleClick() {
    this.setState({ searchView: true });
  }

  searchStage() {
    if (this.state.searchStatus === 'initial') {
      return (
        <div className="row form-button">
          <button className="form-button shadow">Search</button>
        </div>
      );
    } else if (this.state.searchStatus === 'searching') {
      return (
        <div className="row">
          <h3 className="orange">Searching...</h3>
        </div>
      );
    } else if (this.state.searchStatus === 'results') {
      return (
        <div className="row">
          {/* { SearchList(this.state.searchItems) } */}
        </div>
      );
    }
  }

  renderForm() {
    return (
      <>
        <div className="row">
          <div className="col-4 bookmark title shadow">
            <h1 className="orange">New Post</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-2">
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
              <textarea required className="shadow" name="new-game-comments" id="new-game-comments" cols="30" rows="8"></textarea>
            </div>
          </div>
        </div>
        <div className="row form-button">
          <button className="form-button shadow">Post</button>
        </div>
      </>
    );
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
        <form action="#" className="game-search" autoComplete="off">
          {this.renderForm()}
        </form>
        <form onSubmit={this.handleSearch} className={`modal-container ${hidden}`}>
          <div className="row">
            <div className="search-input shadow">
              <div className="search-icon">
                <label htmlFor="new-game-search-modal"><i className="orange fas fa-search"></i></label>
              </div>
              <input required type="text" className="lora" id="new-game-search-modal" name='game' placeholder="Search for a game..." />
            </div>
          </div>
          <>
            {this.searchStage()}
          </>
        </form>
      </>
    );
  }
}

// function SearchList(list) {
//   let searchResults = []
//   searchResults = list.map(item => {
//     return (
//       <div className="col-1">
//         <h3>This is a game!</h3>
//       </div>
//     )
//   })
//   return searchResults
// }
