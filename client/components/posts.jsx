import React from 'react';
import AppContext from '../lib/app-context';
import debounce from '../lib/debounce';

export default class Posts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 'postings',
      searchStatus: 'empty',
      searchValue: '',
      recentPosts: [],
      searchedPosts: [],
      selectedPost: ''
    };
    this.changeView = this.changeView.bind(this);
    this.showPost = this.showPost.bind(this);
    this.handleType = this.handleType.bind(this);
    this.renderView = this.renderView.bind(this);
    this.runSearch = debounce(this.runSearch.bind(this), 500);
    this.renderSearch = this.renderSearch.bind(this);
  }

  componentDidMount() {
    fetch('/api/boardGamePosts')
      .then(response => response.json())
      .then(postInfo => {
        const recentPosts = postInfo.slice();
        this.setState({ recentPosts });
      });
  }

  changeView(event) {
    if (event.target.dataset.view === 'search') {
      this.setState({ view: 'search' });
      this.context.backGroundColor({ bgColor: 'bg-dark-grey' });
    }
  }

  showPost(event) {
    let selectedPost;
    if (this.state.view === 'postings') {
      selectedPost = this.state.recentPosts.find(post => `${post.postId}` === event.target.dataset.postid);
    } else if (this.state.view === 'search') {
      selectedPost = this.state.searchedPosts.find(post => `${post.postId}` === event.target.dataset.postid);
    }
    this.setState({ view: 'postInfo', selectedPost });
    this.context.backGroundColor({ bgColor: '' });
  }

  handleType(event) {
    if (event.target.value !== this.state.searchValue) {
      this.setState({ searchValue: event.target.value }, this.runSearch);
    }
  }

  runSearch() {
    if (this.state.searchValue.length > 0) {
      this.setState({ searchStatus: 'searching' });
      const currentSearch = this.activeSearch = fetch(`/api/boardGamePosts/search/${this.state.searchValue}`)
        .then(response => response.json())
        .then(posts => {
          if (this.activeSearch !== currentSearch) return;
          if (posts.error || posts.length < 1) {
            this.setState({ searchStatus: 'none' });
          } else {
            this.setState({ searchedPosts: posts, searchStatus: 'result' });
          }
        });
    } else {
      this.setState({ searchStatus: 'empty' });
    }
  }

  renderSearch() {
    if (this.state.searchStatus === 'none') {
      return (
        <div className="row search-message">
          <h3 className="orange">No posts were found, try again</h3>
        </div>
      );
    } else if (this.state.searchStatus === 'searching') {
      return (
        <div className="row search-message">
          <h3 className="orange">Searching...</h3>
        </div>
      );
    } else if (this.state.searchStatus === 'result') {
      return (
        <>
          <PostingList postList={this.state.searchedPosts} showPost={this.showPost} />
        </>
      );
    }
  }

  renderView() {
    if (this.state.view === 'postings') {
      return (
        <>
          <div className="row row-2 post-search-bar">
            <div className="search-input shadow col-2">
              <div className="search-icon">
                <label htmlFor="search-bar-postings-view"><i className="orange fas fa-search"></i></label>
              </div>
              <input onClick={this.changeView} data-view="search" readOnly type="text" className="lora" id="search-bar-postings-view" placeholder="Search for a game..." />
            </div>
          </div>
          <div className="row">
            <div className="col-4 bookmark title shadow">
              <h1 className="orange">Postings</h1>
            </div>
          </div>
          <div className="postings-container">
            <PostingList postList={this.state.recentPosts} showPost={this.showPost} />
          </div>
        </>
      );
    } else if (this.state.view === 'search') {
      return (
        <>
          <div className="row row-2 post-search-bar">
            <div className="search-input shadow col-2">
              <div className="search-icon">
                <label htmlFor="search-bar-search-view"><i className="orange fas fa-search"></i></label>
              </div>
              <input autoComplete="off" onKeyUp={this.handleType} type="text" className="lora" id="search-bar-search-view" placeholder="Search for a game..." />
            </div>
          </div>
          <div className="postings-container">
            { this.renderSearch() }
          </div>
        </>
      );
    } else if (this.state.view === 'postInfo') {
      const post = this.state.selectedPost;
      return (
        <>
          <div className="row">
            <div className="col-1 post-info-game shadow">
              <h1 className="orange">{post.gameName}</h1>
            </div>
          </div>
          <div className="row row-2">
            <div className="col-2 post-info-left">
              <div className="col-1 image-post">
                <img className="shadow" src={post.image} alt={post.gameName} />
              </div>
              <div className="col-1 post-info-block-container">
                <div className="post-info-block">
                  <div className="post-info-block-title">
                    <h3 className="orange">Players:</h3>
                  </div>
                  <div className="post-info-block-value">
                    <h3 className="lora">{post.minPlayers === post.maxPlayers ? `${post.maxPlayers}` : `${post.minPlayers} - ${post.maxPlayers}`}</h3>
                  </div>
                </div>
                <div className="post-info-block">
                  <div className="post-info-block-title">
                    <h3 className="orange">Play Time:</h3>
                  </div>
                  <div className="post-info-block-value">
                    <h3 className="lora">{post.minPlayTime === post.maxPlayTime ? `${post.maxPlayTime} min` : `${post.minPlayTime} - ${post.maxPlayTime} min`}</h3>
                  </div>
                </div>
                <div className="post-info-block">
                  <div className="post-info-block-title">
                    <h3 className="orange">Ages:</h3>
                  </div>
                  <div className="post-info-block-value">
                    <h3 className="lora">{`${post.ageLimit}+`}</h3>
                  </div>
                </div>
                <div className="post-info-block">
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
                  <h3 className="lora">{ post.lenderName }</h3>
                </div>
              </div>
              <div className="col-1 post-info-text">
                <div className="shadow post-info-text-title">
                  <h3 className="orange">Lender&apos;s Comments:</h3>
                </div>
                <div className="col-1 shadow post-info-text-value-long">
                  <h3 className="lora">{ post.lenderComments }</h3>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    }
  }

  render() {
    return (
      <>
        { this.renderView() }
      </>
    );
  }
}

Posts.contextType = AppContext;

function PostingList(props) {
  if (props.postList.length < 1) {
    return (<></>);
  } else {
    const $postList = props.postList.map(post => {
      return (
        <PostItem key={post.postId} info={post} showPost={props.showPost}/>
      );
    });
    return (
      <div className="row row-2 post-list">
        { $postList }
      </div>
    );
  }
}

function PostItem(props) {
  const {
    gameName: game,
    lenderName: name,
    image,
    postId
  } = props.info;
  return (
    <div className="post-item col-2 shadow" onClick={props.showPost} data-postid={postId}>
      <div className="post-item-info" data-postid={postId}>
        <div data-postid={postId}>
          <h3 className="orange shadow post-item-info-title" data-postid={postId}>Title</h3>
        </div>
        <div data-postid={postId}>
          <h3 className="shadow lora post-item-info-value" data-postid={postId}>{ game }</h3>
        </div>
        <div data-postid={postId}>
          <h3 className="orange shadow post-item-info-title" data-postid={postId}>Lender</h3>
        </div>
        <div data-postid={postId}>
          <h3 className="shadow lora post-item-info-value" data-postid={postId}>{ name }</h3>
        </div>
      </div>
      <div className="post-item-img" data-postid={postId}>
        <img src={image} alt={game} className="shadow" data-postid={postId}/>
      </div>
    </div>
  );
}
