import React from 'react';
import Redirect from '../components/redirect';
import AppContext from '../lib/app-context';

export default class PostInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      post: null
    };
  }

  componentDidMount() {
    fetch(`/api/boardGamePosts/${this.props.postId}`)
      .then(response => response.json())
      .then(post => this.setState({ post }));
  }

  render() {
    if (!this.context.user) return <Redirect to="sign-in" />;
    if (!this.state.post) {
      return null;
    }
    const { post } = this.state;
    return (
      <>
        <div className="row">
          <div className="col-1 post-info-game shadow">
            <h1 className="text-shadow orange">{post.gameName}</h1>
          </div>
        </div>
        <div className="row row-2">
          <div className="col-2 post-info-left">
            <div className="col-1 image-post">
              <img className="shadow" src={post.image} alt={post.gameName} />
            </div>
            <div className="col-1 post-info-block-container">
              <div className="post-info-block shadow">
                <div className="post-info-block-title">
                  <h3 className="orange">Players:</h3>
                </div>
                <div className="post-info-block-value">
                  <h3 className="lora">{post.minPlayers === post.maxPlayers ? `${post.maxPlayers}` : `${post.minPlayers} - ${post.maxPlayers}`}</h3>
                </div>
              </div>
              <div className="post-info-block shadow">
                <div className="post-info-block-title">
                  <h3 className="orange">Play Time:</h3>
                </div>
                <div className="post-info-block-value">
                  <h3 className="lora">{post.minPlayTime === post.maxPlayTime ? `${post.maxPlayTime} min` : `${post.minPlayTime} - ${post.maxPlayTime} min`}</h3>
                </div>
              </div>
              <div className="post-info-block shadow">
                <div className="post-info-block-title">
                  <h3 className="orange">Ages:</h3>
                </div>
                <div className="post-info-block-value">
                  <h3 className="lora">{`${post.ageLimit}+`}</h3>
                </div>
              </div>
              <div className="post-info-block shadow">
                <div className="post-info-block-title">
                  <h3 className="orange">Year:</h3>
                </div>
                <div className="post-info-block-value">
                  <h3 className="lora">{`${post.yearPublished}`}</h3>
                </div>
              </div>
            </div>
          </div>
          <div className="col-2 post-info-right">
            <div className="col-1 post-info-text">
              <div className="shadow post-info-text-title">
                <h3 className="orange">Description:</h3>
              </div>
              <div className="col-1 shadow post-info-text-value-long">
                <h3 dangerouslySetInnerHTML={{ __html: post.description }} className="lora"></h3>
              </div>
            </div>
            <div className="col-1 post-info-text">
              <div className="shadow post-info-text-title">
                <h3 className="orange">Lender:</h3>
              </div>
              <div className="col-1 shadow post-info-text-value">
                <h3 className="lora">{post.lenderName}</h3>
              </div>
            </div>
            <div className="col-1 post-info-text">
              <div className="shadow post-info-text-title">
                <h3 className="orange">Lender&apos;s Comments:</h3>
              </div>
              <div className="col-1 shadow post-info-text-value-long">
                <h3 className="lora">{post.lenderComments}</h3>
              </div>
            </div>
          </div>
          <div className="row post-info-button">
            <button className="shadow text-shadow" onClick={this.context.handleMessage} >Message Lender</button>
          </div>
        </div>
      </>
    );
  }
}

PostInfo.contextType = AppContext;
