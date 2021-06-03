import React from 'react';

export default class Posts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: ''
    };
  }

  render() {
    return (
      <>
        <div className="row row-2">
          <div className="search-input shadow col-2">
            <div className="search-icon">
              <label htmlFor="new-game-search-modal"><i className="orange fas fa-search"></i></label>
            </div>
            <input autoComplete="off" onKeyUp={this.handleType} required type="text" className="lora" id="new-game-search-modal" name='game' placeholder="Search for a game..." />
          </div>
        </div>
        <div className="row">
          <div className="col-4 bookmark title shadow">
            <h1 className="orange">Postings</h1>
          </div>
        </div>
      </>
    );
  }
}
