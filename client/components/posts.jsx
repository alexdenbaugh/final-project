import React from 'react';

export default class Posts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: '',
      recentPosts: []
    };
  }

  componentDidMount() {
    fetch('/api/boardGamePosts')
      .then(response => response.json())
      .then(postInfo => {
        const recentPosts = postInfo.slice();
        this.setState({ recentPosts });
      });
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
        <div className="postings-container">
          <PostingList postList={this.state.recentPosts} />
        </div>
      </>
    );
  }
}

function PostingList(props) {
  if (props.postList.length < 1) {
    return (<></>);
  } else {
    const $postList = props.postList.map(post => {
      return (
        <PostItem key={post.postId} info={post} />
      );
    });
    return (
      <div className="row row-2">
        { $postList }
      </div>
    );
  }
}

function PostItem(props) {
  const {
    gameName: game,
    lenderName: name,
    image
  } = props.info;
  return (
    <div className="post-item col-2 shadow">
      <div className="post-item-info">
        <div>
          <h3 className="orange shadow post-item-info-title">Title</h3>
        </div>
        <div>
          <h3 className="shadow lora post-item-info-value">{ game }</h3>
        </div>
        <div>
          <h3 className="orange shadow post-item-info-title">Lender</h3>
        </div>
        <div>
          <h3 className="shadow lora post-item-info-value">{ name }</h3>
        </div>
      </div>
      <div className="post-item-img">
        <img src={image} alt={game} className="shadow"/>
      </div>
    </div>
  );
}
