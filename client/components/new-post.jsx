import React from 'react';

export default class NewPostForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searching: false
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleSearch(event) {
    // console.log(event.target.value);

  }

  handleClick() {
    this.setState({ searching: true });
  }

  renderForm() {
    let hidden;
    if (this.state.searching) {
      hidden = '';
    } else {
      hidden = 'hidden';
    }
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
              <div className="input">
                <input onClick={this.handleClick} required type="text" className="lora shadow" id="new-game-search" placeholder="Search for a game..." />
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
        <div className={`modal-container ${hidden}`}>
          <div className="row">
            <div className="col-2">
              <div className="input">
                <input onKeyUp={this.handleSearch} required type="text" className="lora shadow" id="new-game-search" placeholder="Search for a game..." />
              </div>
            </div>
          </div>
          <div className="row">
            {/* { SearchList(this.state.searchItems) } */}
          </div>
        </div>
      </>
    );
  }

  render() {
    return (
      <form action="#" className="game-search" autoComplete="off">
        { this.renderForm() }
      </form>
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
