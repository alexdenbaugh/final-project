import React from 'react';

export default class NewPostForm extends React.Component {
  render() {
    return (
      <form action="#">
        <div className="row">
          <div className="col-4 bookmark shadow">
            <h2 className="orange">New Post</h2>
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
                <input type="text" className="lora shadow" id="new-game-search" placeholder="Search for a game..."/>
              </div>
            </div>
            <div className="form-element">
              <div className="label bookmark shadow">
                <label className="orange" htmlFor="new-game-name">Your Name:</label>
              </div>
              <div className="input">
                <input type="text" className="lora shadow" id="new-game-name" />
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
              <textarea className="shadow" name="new-game-comments" id="new-game-comments" cols="30" rows="8"></textarea>
            </div>
          </div>
        </div>
        <div className="row"></div>
      </form>
    );
  }
}
